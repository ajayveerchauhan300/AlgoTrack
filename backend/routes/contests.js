import express from "express";

const router = express.Router();

// GET UPCOMING CONTEST_REMINDERS
router.get("/", async (req, res) => {
  try {
    const upcoming = [];
    // Add Leetcode Weekly & Biweekly Contests as standard schedule items
    const now = Date.now();
    // Simple algorithm to get upcoming Saturday and Sunday
    const getNextDayOfWeek = (dayOfWeek, hour, minute) => {
      const resultDate = new Date();
      resultDate.setDate(
        resultDate.getDate() + ((7 + dayOfWeek - resultDate.getDay()) % 7),
      );
      resultDate.setHours(hour, minute, 0, 0);
      if (resultDate.getTime() < Date.now()) {
        resultDate.setDate(resultDate.getDate() + 7);
      }
      return resultDate.getTime();
    };

    upcoming.push({
      id: "lc-weekly-1",
      title: "LeetCode Weekly Contest 442",
      platform: "LeetCode",
      startTime: getNextDayOfWeek(0, 8, 0), // Next Sunday 8:00 AM UTC
      duration: 5400, // 1.5 Hour
      url: "https://leetcode.com/contest/",
    });

    upcoming.push({
      id: "lc-biweekly-1",
      title: "LeetCode Biweekly Contest 155",
      platform: "LeetCode",
      startTime: getNextDayOfWeek(6, 14, 30), // Next Saturday 2:30 PM UTC
      duration: 5400,
      url: "https://leetcode.com/contest/",
    });

    // Try to fetch CF Upcoming contests or populate backup list
    try {
      const cfResponse = await fetch(
        "https://codeforces.com/api/contest.list?gym=false",
      );
      if (cfResponse.ok) {
        const data = await cfResponse.json();
        if (data.status === "OK") {
          const cfUpcoming = data.result
            .filter((c) => c.phase === "BEFORE")
            .map((c) => ({
              id: `cf-${c.id}`,
              title: c.name,
              platform: "Codeforces",
              startTime: c.startTimeSeconds * 1000,
              duration: c.durationSeconds,
              url: `https://codeforces.com/contest/${c.id}`,
            }));

          // Sort chronological and merge
          upcoming.push(...cfUpcoming);
        }
      }
    } catch (cfErr) {
      console.warn(
        "CF upcoming contest fetch failed. Adding fallback CF contest schedule.",
      );
    }

    if (upcoming.length <= 2) {
      // CF Backup
      upcoming.push({
        id: "cf-backup-1",
        title: "Codeforces Round 1005 (Div. 2)",
        platform: "Codeforces",
        startTime: getNextDayOfWeek(1, 14, 35), // Next Monday
        duration: 7200, // 2 Hours
        url: "https://codeforces.com/contests",
      });
      upcoming.push({
        id: "cf-backup-2",
        title: "Codeforces Round 1006 (Div. 3)",
        platform: "Codeforces",
        startTime: getNextDayOfWeek(3, 14, 35), // Next Wednesday
        duration: 7200,
        url: "https://codeforces.com/contests",
      });
    }

    // Sort by startTime
    upcoming.sort((a, b) => a.startTime - b.startTime);

    res.json({ contests: upcoming });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to load contests" });
  }
});

export default router;
