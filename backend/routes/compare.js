import express from "express";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";
import { generateFallbackStats } from "./stats.js";

const router = express.Router();

const normalizeHandle = (value) =>
  typeof value === "string" ? value.trim() : "";

const fetchCodeforcesStats = async (handle) => {
  const cfStats = {
    rating: undefined,
    maxRating: undefined,
    rank: undefined,
    maxRank: undefined,
    contestCount: 0,
    totalSolved: 0,
    contestHistory: [],
    recentSubmissionsCount: 0,
  };

  if (!handle) return cfStats;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const responseInfo = await fetch(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
      { signal: controller.signal },
    );
    clearTimeout(timeoutId);

    if (responseInfo.ok) {
      const dataInfo = await responseInfo.json();
      if (dataInfo.status === "OK" && Array.isArray(dataInfo.result)) {
        const result = dataInfo.result[0];
        if (result) {
          cfStats.rating = result.rating;
          cfStats.maxRating = result.maxRating;
          cfStats.rank = result.rank;
          cfStats.maxRank = result.maxRank;
        }
      }
    }

    const solved = new Set();
    let from = 1;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const statusController = new AbortController();
      const statusTimeout = setTimeout(() => statusController.abort(), 10000);
      const responseStatus = await fetch(
        `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=${from}&count=${batchSize}`,
        { signal: statusController.signal },
      );
      clearTimeout(statusTimeout);

      if (!responseStatus.ok) {
        hasMore = false;
        break;
      }

      const dataStatus = await responseStatus.json();
      if (dataStatus.status !== "OK" || !Array.isArray(dataStatus.result)) {
        hasMore = false;
        break;
      }

      const batch = dataStatus.result;
      if (batch.length === 0) {
        hasMore = false;
        break;
      }

      for (const submission of batch) {
        const verdict = submission.verdict;
        const problem = submission.problem;
        if (
          verdict === "OK" &&
          submission.testset === "TESTS" &&
          problem?.contestId != null &&
          problem?.index != null
        ) {
          solved.add(`${problem.contestId}-${problem.index}`);
        }
      }

      if (batch.length < batchSize) {
        hasMore = false;
      } else {
        from += batchSize;
      }
    }

    cfStats.totalSolved = solved.size;

    const historyController = new AbortController();
    const historyTimeout = setTimeout(() => historyController.abort(), 4000);
    const responseRating = await fetch(
      `https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`,
      { signal: historyController.signal },
    );
    clearTimeout(historyTimeout);

    if (responseRating.ok) {
      const dataRating = await responseRating.json();
      if (dataRating.status === "OK" && Array.isArray(dataRating.result)) {
        cfStats.contestHistory = dataRating.result;
        cfStats.contestCount = dataRating.result.length;
      }
    }
  } catch (error) {
    console.warn(`Codeforces fetch failed for ${handle}:`, error.message);
  }

  return cfStats;
};

const fetchLeetCodeStats = async (username) => {
  const lcStats = {
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    contestRating: undefined,
    globalRanking: undefined,
  };

  if (!username) return lcStats;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            allQuestionsCount {
              difficulty
              count
            }
            matchedUser(username: $username) {
              username
              profile {
                ranking
              }
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
            userContestRanking(username: $username) {
              rating
              globalRanking
            }
          }
        `,
        variables: { username },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const resJson = await response.json();
      const data = resJson.data;
      if (data && data.matchedUser) {
        const mu = data.matchedUser;
        lcStats.globalRanking = mu.profile?.ranking;

        const acSub = mu.submitStats?.acSubmissionNum;
        if (acSub) {
          const all = acSub.find((x) => x.difficulty === "All");
          const easy = acSub.find((x) => x.difficulty === "Easy");
          const med = acSub.find((x) => x.difficulty === "Medium");
          const hard = acSub.find((x) => x.difficulty === "Hard");

          lcStats.totalSolved = all ? all.count : 0;
          lcStats.easySolved = easy ? easy.count : 0;
          lcStats.mediumSolved = med ? med.count : 0;
          lcStats.hardSolved = hard ? hard.count : 0;
        }

        if (data.userContestRanking) {
          lcStats.contestRating = Math.round(data.userContestRanking.rating);
          if (!lcStats.globalRanking) {
            lcStats.globalRanking = data.userContestRanking.globalRanking;
          }
        }
      }
    }
  } catch (error) {
    console.warn(`LeetCode fetch failed for ${username}:`, error.message);
  }

  return lcStats;
};

const buildProfile = async (cfHandle, lcUsername) => {
  const fallback = generateFallbackStats(cfHandle, lcUsername);

  const [cfStats, lcStats] = await Promise.all([
    fetchCodeforcesStats(cfHandle),
    fetchLeetCodeStats(lcUsername),
  ]);

  return {
    ...fallback,
    leetcode: {
      totalSolved: lcStats.totalSolved || fallback.leetcode.totalSolved,
      easySolved: lcStats.easySolved || fallback.leetcode.easySolved,
      mediumSolved: lcStats.mediumSolved || fallback.leetcode.mediumSolved,
      hardSolved: lcStats.hardSolved || fallback.leetcode.hardSolved,
      contestRating:
        lcStats.contestRating || fallback.leetcode.contestRating,
      globalRanking: lcStats.globalRanking || fallback.leetcode.globalRanking,
    },
    codeforces: {
      rating: cfStats.rating || fallback.codeforces.rating,
      maxRating: cfStats.maxRating || fallback.codeforces.maxRating,
      rank: cfStats.rank || fallback.codeforces.rank,
      maxRank: cfStats.maxRank || fallback.codeforces.maxRank,
      contestCount:
        cfStats.contestCount || fallback.codeforces.contestCount,
      totalQuestions: cfStats.totalSolved,
      contestHistory: cfStats.contestHistory.length
        ? cfStats.contestHistory
        : fallback.codeforces.contestHistory,
      recentSubmissionsCount:
        cfStats.recentSubmissionsCount ||
        fallback.codeforces.recentSubmissionsCount,
    },
  };
};

// COMPARE MULTIPLE USERS
router.get("/", authenticateToken, async (req, res) => {
  try {
    const friendCF = normalizeHandle(req.query.friendCF);
    const friendLC = normalizeHandle(req.query.friendLC);

    const currentUser = await User.findById(req.userId);

    const handleA_cf = normalizeHandle(currentUser?.codeforcesHandle) || "Ajay";
    const handleA_lc =
      normalizeHandle(currentUser?.leetcodeUsername) || "ajay_leetcode";

    const [statsA, statsB] = await Promise.all([
      buildProfile(handleA_cf, handleA_lc),
      buildProfile(friendCF || "tourist", friendLC || "friend_demo"),
    ]);

    const metrics = [
      {
        metric: "Codeforces Rating",
        userA: statsA.codeforces.rating || "N/A",
        userB: statsB.codeforces.rating || "N/A",
      },
      {
        metric: "Codeforces Total Solved",
        userA: statsA.codeforces.totalQuestions || "N/A",
        userB: statsB.codeforces.totalQuestions || "N/A",
      },
      {
        metric: "LeetCode Solved (Total)",
        userA: statsA.leetcode.totalSolved,
        userB: statsB.leetcode.totalSolved,
      },
      {
        metric: "LeetCode Easy",
        userA: statsA.leetcode.easySolved,
        userB: statsB.leetcode.easySolved,
      },
      {
        metric: "LeetCode Medium",
        userA: statsA.leetcode.mediumSolved,
        userB: statsB.leetcode.mediumSolved,
      },
      {
        metric: "LeetCode Hard",
        userA: statsA.leetcode.hardSolved,
        userB: statsB.leetcode.hardSolved,
      },
      {
        metric: "Contests Completed",
        userA: statsA.codeforces.contestCount,
        userB: statsB.codeforces.contestCount,
      },
      {
        metric: "Current Consistency Streak",
        userA: `${statsA.streak} days`,
        userB: `${statsB.streak} days`,
      },
    ];

    res.json({
      metrics,
      statsA,
      statsB,
      userAName: currentUser?.name || "You",
      userBName: friendCF || friendLC || "Friend",
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to compare users" });
  }
});

export default router;
