import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Code2,
  Cpu,
  ChevronDown,
  ChevronUp,
  FileText,
  BarChart,
  Star,
} from "lucide-react";

// Mock Data for Problem Sheets

const striverSheetData = [
  {
    topic: "Arrays",
    problems: [
      {
        id: "lc-1",
        name: "Two Sum",
        url: "https://leetcode.com/problems/two-sum/",
        difficulty: "Easy",
      },
      {
        id: "lc-2",
        name: "Best Time to Buy and Sell Stock",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        difficulty: "Easy",
      },
      {
        id: "lc-3",
        name: "Contains Duplicate",
        url: "https://leetcode.com/problems/contains-duplicate/",
        difficulty: "Easy",
      },
      {
        id: "lc-4",
        name: "Product of Array Except Self",
        url: "https://leetcode.com/problems/product-of-array-except-self/",
        difficulty: "Medium",
      },
      {
        id: "lc-5",
        name: "Maximum Subarray",
        url: "https://leetcode.com/problems/maximum-subarray/",
        difficulty: "Medium",
      },
    ],
  },
  {
    topic: "Strings",
    problems: [
      {
        id: "lc-6",
        name: "Valid Anagram",
        url: "https://leetcode.com/problems/valid-anagram/",
        difficulty: "Easy",
      },
      {
        id: "lc-7",
        name: "Valid Palindrome",
        url: "https://leetcode.com/problems/valid-palindrome/",
        difficulty: "Easy",
      },
      {
        id: "lc-8",
        name: "Longest Common Prefix",
        url: "https://leetcode.com/problems/longest-common-prefix/",
        difficulty: "Easy",
      },
      {
        id: "lc-9",
        name: "Reverse String",
        url: "https://leetcode.com/problems/reverse-string/",
        difficulty: "Easy",
      },
      {
        id: "lc-10",
        name: "Implement strStr()",
        url: "https://leetcode.com/problems/implement-strstr/",
        difficulty: "Easy",
      },
    ],
  },
  {
    topic: "Math",
    problems: [
      {
        id: "lc-11",
        name: "Palindrome Number",
        url: "https://leetcode.com/problems/palindrome-number/",
        difficulty: "Easy",
      },
      {
        id: "lc-12",
        name: "Plus One",
        url: "https://leetcode.com/problems/plus-one/",
        difficulty: "Easy",
      },
      {
        id: "lc-13",
        name: "Sqrt(x)",
        url: "https://leetcode.com/problems/sqrtx/",
        difficulty: "Easy",
      },
    ],
  },
  {
    topic: "Phase 2: Hashing & Sliding Window",
    problems: [
      {
        id: "lc-14",
        name: "Group Anagrams",
        url: "https://leetcode.com/problems/group-anagrams/",
        difficulty: "Medium",
      },
      {
        id: "lc-15",
        name: "Top K Frequent Elements",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
        difficulty: "Medium",
      },
      {
        id: "lc-16",
        name: "Longest Consecutive Sequence",
        url: "https://leetcode.com/problems/longest-consecutive-sequence/",
        difficulty: "Medium",
      },
      {
        id: "lc-17",
        name: "Maximum Average Subarray I",
        url: "https://leetcode.com/problems/maximum-average-subarray-i/",
        difficulty: "Easy",
      },
      {
        id: "lc-18",
        name: "Longest Substring Without Repeating Characters",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        difficulty: "Medium",
      },
      {
        id: "lc-19",
        name: "Permutation in String",
        url: "https://leetcode.com/problems/permutation-in-string/",
        difficulty: "Medium",
      },
      {
        id: "lc-20",
        name: "Minimum Window Substring",
        url: "https://leetcode.com/problems/minimum-window-substring/",
        difficulty: "Hard",
      },
    ],
  },
  {
    topic: "Phase 3: Linked List",
    problems: [
      {
        id: "lc-21",
        name: "Reverse Linked List",
        url: "https://leetcode.com/problems/reverse-linked-list/",
        difficulty: "Easy",
      },
      {
        id: "lc-22",
        name: "Middle of the Linked List",
        url: "https://leetcode.com/problems/middle-of-the-linked-list/",
        difficulty: "Easy",
      },
      {
        id: "lc-23",
        name: "Merge Two Sorted Lists",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
        difficulty: "Easy",
      },
      {
        id: "lc-24",
        name: "Remove Nth Node From End of List",
        url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        difficulty: "Medium",
      },
      {
        id: "lc-25",
        name: "Linked List Cycle",
        url: "https://leetcode.com/problems/linked-list-cycle/",
        difficulty: "Easy",
      },
      {
        id: "lc-26",
        name: "Intersection of Two Linked Lists",
        url: "https://leetcode.com/problems/intersection-of-two-linked-lists/",
        difficulty: "Easy",
      },
      {
        id: "lc-27",
        name: "Add Two Numbers",
        url: "https://leetcode.com/problems/add-two-numbers/",
        difficulty: "Medium",
      },
      {
        id: "lc-28",
        name: "Copy List with Random Pointer",
        url: "https://leetcode.com/problems/copy-list-with-random-pointer/",
        difficulty: "Medium",
      },
    ],
  },
  {
    topic: "Phase 4: Stack & Queue",
    problems: [
      {
        id: "lc-29",
        name: "Valid Parentheses",
        url: "https://leetcode.com/problems/valid-parentheses/",
        difficulty: "Easy",
      },
      {
        id: "lc-30",
        name: "Min Stack",
        url: "https://leetcode.com/problems/min-stack/",
        difficulty: "Medium",
      },
      {
        id: "lc-31",
        name: "Daily Temperatures",
        url: "https://leetcode.com/problems/daily-temperatures/",
        difficulty: "Medium",
      },
      {
        id: "lc-32",
        name: "Next Greater Element I",
        url: "https://leetcode.com/problems/next-greater-element-i/",
        difficulty: "Easy",
      },
      {
        id: "lc-33",
        name: "Largest Rectangle in Histogram",
        url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        difficulty: "Hard",
      },
      {
        id: "lc-34",
        name: "Implement Queue using Stacks",
        url: "https://leetcode.com/problems/implement-queue-using-stacks/",
        difficulty: "Easy",
      },
      {
        id: "lc-35",
        name: "Moving Average from Data Stream",
        url: "https://leetcode.com/problems/moving-average-from-data-stream/",
        difficulty: "Easy",
      },
    ],
  },
  {
    topic: "Phase 5: Binary Search",
    problems: [
      {
        id: "lc-36",
        name: "Binary Search",
        url: "https://leetcode.com/problems/binary-search/",
        difficulty: "Easy",
      },
      {
        id: "lc-37",
        name: "Search Insert Position",
        url: "https://leetcode.com/problems/search-insert-position/",
        difficulty: "Easy",
      },
      {
        id: "lc-38",
        name: "First Bad Version",
        url: "https://leetcode.com/problems/first-bad-version/",
        difficulty: "Easy",
      },
      {
        id: "lc-39",
        name: "Search in Rotated Sorted Array",
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        difficulty: "Medium",
      },
      {
        id: "lc-40",
        name: "Find Peak Element",
        url: "https://leetcode.com/problems/find-peak-element/",
        difficulty: "Medium",
      },
      {
        id: "lc-41",
        name: "Koko Eating Bananas",
        url: "https://leetcode.com/problems/koko-eating-bananas/",
        difficulty: "Medium",
      },
      {
        id: "lc-42",
        name: "Median of Two Sorted Arrays",
        url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        difficulty: "Hard",
      },
    ],
  },
  {
    topic: "Phase 6: Recursion & Backtracking",
    problems: [
      {
        id: "lc-43",
        name: "Subsets",
        url: "https://leetcode.com/problems/subsets/",
        difficulty: "Medium",
      },
      {
        id: "lc-44",
        name: "Subsets II",
        url: "https://leetcode.com/problems/subsets-ii/",
        difficulty: "Medium",
      },
      {
        id: "lc-45",
        name: "Permutations",
        url: "https://leetcode.com/problems/permutations/",
        difficulty: "Medium",
      },
      {
        id: "lc-46",
        name: "Combination Sum",
        url: "https://leetcode.com/problems/combination-sum/",
        difficulty: "Medium",
      },
      {
        id: "lc-47",
        name: "Combination Sum II",
        url: "https://leetcode.com/problems/combination-sum-ii/",
        difficulty: "Medium",
      },
      {
        id: "lc-48",
        name: "Letter Combinations of a Phone Number",
        url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
        difficulty: "Medium",
      },
      {
        id: "lc-49",
        name: "Generate Parentheses",
        url: "https://leetcode.com/problems/generate-parentheses/",
        difficulty: "Medium",
      },
      {
        id: "lc-50",
        name: "N-Queens",
        url: "https://leetcode.com/problems/n-queens/",
        difficulty: "Hard",
      },
      {
        id: "lc-51",
        name: "Sudoku Solver",
        url: "https://leetcode.com/problems/sudoku-solver/",
        difficulty: "Hard",
      },
    ],
  },
  {
    topic: "Phase 7: Trees",
    problems: [
      {
        id: "lc-52",
        name: "Binary Tree Inorder Traversal",
        url: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
        difficulty: "Easy",
      },
      {
        id: "lc-53",
        name: "Binary Tree Preorder Traversal",
        url: "https://leetcode.com/problems/binary-tree-preorder-traversal/",
        difficulty: "Easy",
      },
      {
        id: "lc-54",
        name: "Binary Tree Postorder Traversal",
        url: "https://leetcode.com/problems/binary-tree-postorder-traversal/",
        difficulty: "Easy",
      },
      {
        id: "lc-55",
        name: "Binary Tree Level Order Traversal",
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        difficulty: "Medium",
      },
      {
        id: "lc-56",
        name: "Diameter of Binary Tree",
        url: "https://leetcode.com/problems/diameter-of-binary-tree/",
        difficulty: "Easy",
      },
      {
        id: "lc-57",
        name: "Balanced Binary Tree",
        url: "https://leetcode.com/problems/balanced-binary-tree/",
        difficulty: "Easy",
      },
      {
        id: "lc-58",
        name: "Maximum Depth of Binary Tree",
        url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        difficulty: "Easy",
      },
      {
        id: "lc-59",
        name: "Path Sum",
        url: "https://leetcode.com/problems/path-sum/",
        difficulty: "Easy",
      },
      {
        id: "lc-60",
        name: "Binary Tree Right Side View",
        url: "https://leetcode.com/problems/binary-tree-right-side-view/",
        difficulty: "Medium",
      },
      {
        id: "lc-61",
        name: "Binary Tree Zigzag Level Order Traversal",
        url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
        difficulty: "Medium",
      },
      {
        id: "lc-62",
        name: "Boundary of Binary Tree",
        url: "https://leetcode.com/problems/boundary-of-binary-tree/",
        difficulty: "Medium",
      },
      {
        id: "lc-63",
        name: "Lowest Common Ancestor of a Binary Tree",
        url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
        difficulty: "Medium",
      },
      {
        id: "lc-64",
        name: "Binary Tree Maximum Path Sum",
        url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        difficulty: "Hard",
      },
      {
        id: "lc-65",
        name: "Serialize and Deserialize Binary Tree",
        url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        difficulty: "Hard",
      },
    ],
  },
  {
    topic: "Phase 8: BST",
    problems: [
      {
        id: "lc-66",
        name: "Search in a Binary Search Tree",
        url: "https://leetcode.com/problems/search-in-a-binary-search-tree/",
        difficulty: "Easy",
      },
      {
        id: "lc-67",
        name: "Insert into a Binary Search Tree",
        url: "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
        difficulty: "Medium",
      },
      {
        id: "lc-68",
        name: "Delete Node in a BST",
        url: "https://leetcode.com/problems/delete-node-in-a-bst/",
        difficulty: "Medium",
      },
      {
        id: "lc-69",
        name: "Validate Binary Search Tree",
        url: "https://leetcode.com/problems/validate-binary-search-tree/",
        difficulty: "Medium",
      },
      {
        id: "lc-70",
        name: "Kth Smallest Element in a BST",
        url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
        difficulty: "Medium",
      },
      {
        id: "lc-71",
        name: "Inorder Successor in BST",
        url: "https://leetcode.com/problems/inorder-successor-in-bst/",
        difficulty: "Medium",
      },
      {
        id: "lc-72",
        name: "Recover Binary Search Tree",
        url: "https://leetcode.com/problems/recover-binary-search-tree/",
        difficulty: "Hard",
      },
    ],
  },
  {
    topic: "Phase 9: Heap / Priority Queue",
    problems: [
      {
        id: "lc-73",
        name: "Kth Largest Element in an Array",
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        difficulty: "Medium",
      },
      {
        id: "lc-74",
        name: "Top K Frequent Elements",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
        difficulty: "Medium",
      },
      {
        id: "lc-75",
        name: "Last Stone Weight",
        url: "https://leetcode.com/problems/last-stone-weight/",
        difficulty: "Easy",
      },
      {
        id: "lc-76",
        name: "Merge k Sorted Lists",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
        difficulty: "Hard",
      },
      {
        id: "lc-77",
        name: "Find Median from Data Stream",
        url: "https://leetcode.com/problems/find-median-from-data-stream/",
        difficulty: "Hard",
      },
    ],
  },
  {
    topic: "Phase 10: Greedy",
    problems: [
      {
        id: "lc-78",
        name: "Assign Cookies",
        url: "https://leetcode.com/problems/assign-cookies/",
        difficulty: "Easy",
      },
      {
        id: "lc-79",
        name: "Jump Game",
        url: "https://leetcode.com/problems/jump-game/",
        difficulty: "Medium",
      },
      {
        id: "lc-80",
        name: "Jump Game II",
        url: "https://leetcode.com/problems/jump-game-ii/",
        difficulty: "Medium",
      },
      {
        id: "lc-81",
        name: "Gas Station",
        url: "https://leetcode.com/problems/gas-station/",
        difficulty: "Medium",
      },
      {
        id: "lc-82",
        name: "Candy",
        url: "https://leetcode.com/problems/candy/",
        difficulty: "Hard",
      },
      {
        id: "lc-83",
        name: "Non-overlapping Intervals",
        url: "https://leetcode.com/problems/non-overlapping-intervals/",
        difficulty: "Medium",
      },
      {
        id: "lc-84",
        name: "Task Scheduler",
        url: "https://leetcode.com/problems/task-scheduler/",
        difficulty: "Medium",
      },
    ],
  },
  {
    topic: "Phase 11: Graphs",
    problems: [
      {
        id: "lc-85",
        name: "Number of Islands",
        url: "https://leetcode.com/problems/number-of-islands/",
        difficulty: "Medium",
      },
      {
        id: "lc-86",
        name: "Flood Fill",
        url: "https://leetcode.com/problems/flood-fill/",
        difficulty: "Easy",
      },
      {
        id: "lc-87",
        name: "Clone Graph",
        url: "https://leetcode.com/problems/clone-graph/",
        difficulty: "Medium",
      },
      {
        id: "lc-88",
        name: "Rotting Oranges",
        url: "https://leetcode.com/problems/rotting-oranges/",
        difficulty: "Medium",
      },
      {
        id: "lc-89",
        name: "Course Schedule",
        url: "https://leetcode.com/problems/course-schedule/",
        difficulty: "Medium",
      },
      {
        id: "lc-90",
        name: "Course Schedule II",
        url: "https://leetcode.com/problems/course-schedule-ii/",
        difficulty: "Medium",
      },
      {
        id: "lc-91",
        name: "Network Delay Time",
        url: "https://leetcode.com/problems/network-delay-time/",
        difficulty: "Medium",
      },
      {
        id: "lc-92",
        name: "Cheapest Flights Within K Stops",
        url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        difficulty: "Medium",
      },
      {
        id: "lc-93",
        name: "Number of Provinces",
        url: "https://leetcode.com/problems/number-of-provinces/",
        difficulty: "Medium",
      },
      {
        id: "lc-94",
        name: "Accounts Merge",
        url: "https://leetcode.com/problems/accounts-merge/",
        difficulty: "Medium",
      },
      {
        id: "lc-95",
        name: "Word Ladder",
        url: "https://leetcode.com/problems/word-ladder/",
        difficulty: "Hard",
      },
      {
        id: "lc-96",
        name: "Alien Dictionary",
        url: "https://leetcode.com/problems/alien-dictionary/",
        difficulty: "Hard",
      },
    ],
  },
  {
    topic: "Phase 12: Dynamic Programming",
    problems: [
      {
        id: "lc-97",
        name: "Fibonacci Number",
        url: "https://leetcode.com/problems/fibonacci-number/",
        difficulty: "Easy",
      },
      {
        id: "lc-98",
        name: "Climbing Stairs",
        url: "https://leetcode.com/problems/climbing-stairs/",
        difficulty: "Easy",
      },
      {
        id: "lc-99",
        name: "House Robber",
        url: "https://leetcode.com/problems/house-robber/",
        difficulty: "Medium",
      },
      {
        id: "lc-100",
        name: "House Robber II",
        url: "https://leetcode.com/problems/house-robber-ii/",
        difficulty: "Medium",
      },
      {
        id: "lc-101",
        name: "Coin Change",
        url: "https://leetcode.com/problems/coin-change/",
        difficulty: "Medium",
      },
      {
        id: "lc-102",
        name: "Unique Paths",
        url: "https://leetcode.com/problems/unique-paths/",
        difficulty: "Medium",
      },
      {
        id: "lc-103",
        name: "Minimum Path Sum",
        url: "https://leetcode.com/problems/minimum-path-sum/",
        difficulty: "Medium",
      },
      {
        id: "lc-104",
        name: "Triangle",
        url: "https://leetcode.com/problems/triangle/",
        difficulty: "Medium",
      },
      {
        id: "lc-105",
        name: "Subset Sum",
        url: "https://leetcode.com/problems/subset-sum/",
        difficulty: "Medium",
      },
      {
        id: "lc-106",
        name: "Partition Equal Subset Sum",
        url: "https://leetcode.com/problems/partition-equal-subset-sum/",
        difficulty: "Medium",
      },
      {
        id: "lc-107",
        name: "Target Sum",
        url: "https://leetcode.com/problems/target-sum/",
        difficulty: "Medium",
      },
      {
        id: "lc-108",
        name: "Longest Common Subsequence",
        url: "https://leetcode.com/problems/longest-common-subsequence/",
        difficulty: "Medium",
      },
      {
        id: "lc-109",
        name: "Longest Palindromic Subsequence",
        url: "https://leetcode.com/problems/longest-palindromic-subsequence/",
        difficulty: "Medium",
      },
      {
        id: "lc-110",
        name: "Edit Distance",
        url: "https://leetcode.com/problems/edit-distance/",
        difficulty: "Hard",
      },
      {
        id: "lc-111",
        name: "Distinct Subsequences",
        url: "https://leetcode.com/problems/distinct-subsequences/",
        difficulty: "Hard",
      },
      {
        id: "lc-112",
        name: "Longest Increasing Subsequence",
        url: "https://leetcode.com/problems/longest-increasing-subsequence/",
        difficulty: "Medium",
      },
      {
        id: "lc-113",
        name: "Number of Longest Increasing Subsequence",
        url: "https://leetcode.com/problems/number-of-longest-increasing-subsequence/",
        difficulty: "Medium",
      },
      {
        id: "lc-114",
        name: "Best Time to Buy and Sell Stock",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        difficulty: "Easy",
      },
      {
        id: "lc-115",
        name: "Best Time to Buy and Sell Stock II",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
        difficulty: "Medium",
      },
      {
        id: "lc-116",
        name: "Best Time to Buy and Sell Stock III",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
        difficulty: "Hard",
      },
      {
        id: "lc-117",
        name: "Best Time to Buy and Sell Stock IV",
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",
        difficulty: "Hard",
      },
    ],
  },
  {
    topic: "Phase 13: Tries",
    problems: [
      {
        id: "lc-118",
        name: "Implement Trie (Prefix Tree)",
        url: "https://leetcode.com/problems/implement-trie-prefix-tree/",
        difficulty: "Medium",
      },
      {
        id: "lc-119",
        name: "Design Add and Search Words Data Structure",
        url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
        difficulty: "Medium",
      },
      {
        id: "lc-120",
        name: "Search Suggestions System",
        url: "https://leetcode.com/problems/search-suggestions-system/",
        difficulty: "Medium",
      },
      {
        id: "lc-121",
        name: "Maximum XOR of Two Numbers in an Array",
        url: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
        difficulty: "Medium",
      },
    ],
  },
  {
    topic: "Phase 14: Bit Manipulation",
    problems: [
      {
        id: "lc-122",
        name: "Single Number",
        url: "https://leetcode.com/problems/single-number/",
        difficulty: "Easy",
      },
      {
        id: "lc-123",
        name: "Missing Number",
        url: "https://leetcode.com/problems/missing-number/",
        difficulty: "Easy",
      },
      {
        id: "lc-124",
        name: "Counting Bits",
        url: "https://leetcode.com/problems/counting-bits/",
        difficulty: "Easy",
      },
      {
        id: "lc-125",
        name: "Reverse Bits",
        url: "https://leetcode.com/problems/reverse-bits/",
        difficulty: "Easy",
      },
      {
        id: "lc-126",
        name: "Bitwise AND of Numbers Range",
        url: "https://leetcode.com/problems/bitwise-and-of-numbers-range/",
        difficulty: "Medium",
      },
    ],
  },
];

const cp31SheetData = [
  {
    rating: "800",
    problems: [
      {
        id: "cf-1",
        name: "Halloumi Boxes",
        url: "https://codeforces.com/problemset/problem/1903/A",
      },
      {
        id: "cf-2",
        name: "Line Trip",
        url: "https://codeforces.com/problemset/problem/1901/A",
      },
      {
        id: "cf-3",
        name: "Cover in Water",
        url: "https://codeforces.com/problemset/problem/1900/A",
      },
      {
        id: "cf-4",
        name: "Game with Integers",
        url: "https://codeforces.com/problemset/problem/1899/A",
      },
    ],
  },
  {
    rating: "900",
    problems: [
      {
        id: "cf-5",
        name: "Forked!",
        url: "https://codeforces.com/problemset/problem/1904/A",
      },
      {
        id: "cf-6",
        name: "Chemistry",
        url: "https://codeforces.com/problemset/problem/1883/B",
      },
      {
        id: "cf-7",
        name: "Vasilije in Cacak",
        url: "https://codeforces.com/problemset/problem/1878/C",
      },
      {
        id: "cf-8",
        name: "Make It Zero",
        url: "https://codeforces.com/problemset/problem/1869/A",
      },
    ],
  },
  {
    rating: "1000",
    problems: [
      {
        id: "cf-9",
        name: "Swap and Delete",
        url: "https://codeforces.com/problemset/problem/1913/B",
      },
      {
        id: "cf-10",
        name: "Monsters",
        url: "https://codeforces.com/problemset/problem/1849/B",
      },
      {
        id: "cf-11",
        name: "Shoe Shuffling",
        url: "https://codeforces.com/problemset/problem/1691/B",
      },
      {
        id: "cf-12",
        name: "Olya and Game with Arrays",
        url: "https://codeforces.com/problemset/problem/1859/B",
      },
    ],
  },
  {
    rating: "1100",
    problems: [
      {
        id: "cf-13",
        name: "Yarik and Array",
        url: "https://codeforces.com/problemset/problem/1899/C",
      },
      {
        id: "cf-14",
        name: "250 Thousand Tons of TNT",
        url: "https://codeforces.com/problemset/problem/1899/B",
      },
      {
        id: "cf-15",
        name: "Deja Vu",
        url: "https://codeforces.com/problemset/problem/1891/B",
      },
      {
        id: "cf-16",
        name: "Building an Aquarium",
        url: "https://codeforces.com/problemset/problem/1873/E",
      },
    ],
  },
  {
    rating: "1200",
    problems: [
      {
        id: "cf-17",
        name: "Erase First or Second Letter",
        url: "https://codeforces.com/problemset/problem/1917/B",
      },
      {
        id: "cf-18",
        name: "Quests",
        url: "https://codeforces.com/problemset/problem/1914/C",
      },
      {
        id: "cf-19",
        name: "Collecting Game",
        url: "https://codeforces.com/problemset/problem/1904/B",
      },
      {
        id: "cf-20",
        name: "2D Traveling",
        url: "https://codeforces.com/problemset/problem/1869/B",
      },
    ],
  },
  {
    rating: "1300",
    problems: [
      {
        id: "cf-21",
        name: "Find B",
        url: "https://codeforces.com/problemset/problem/1955/D",
      },
      {
        id: "cf-22",
        name: "Seraphim the Owl",
        url: "https://codeforces.com/problemset/problem/1930/C",
      },
      {
        id: "cf-23",
        name: "Romantic Glasses",
        url: "https://codeforces.com/problemset/problem/1915/E",
      },
      {
        id: "cf-24",
        name: "Deep Down Below",
        url: "https://codeforces.com/problemset/problem/1561/C",
      },
    ],
  },
  {
    rating: "1400",
    problems: [
      {
        id: "cf-25",
        name: "Anna and the Valentine's Day Gift",
        url: "https://codeforces.com/problemset/problem/1931/E",
      },
      {
        id: "cf-26",
        name: "Jumping Through Segments",
        url: "https://codeforces.com/problemset/problem/1907/D",
      },
      {
        id: "cf-27",
        name: "Smilo and Monsters",
        url: "https://codeforces.com/problemset/problem/1891/C",
      },
    ],
  },
  {
    rating: "1500",
    problems: [
      {
        id: "cf-28",
        name: "Find the Car",
        url: "https://codeforces.com/problemset/problem/1971/E",
      },
      {
        id: "cf-29",
        name: "Greetings",
        url: "https://codeforces.com/problemset/problem/1915/F",
      },
      {
        id: "cf-30",
        name: "Powered Addition",
        url: "https://codeforces.com/problemset/problem/1638/C",
      },
    ],
  },
  {
    rating: "1600",
    problems: [
      {
        id: "cf-31",
        name: "White Magic",
        url: "https://codeforces.com/problemset/problem/1973/B",
      },
      {
        id: "cf-32",
        name: "Earning on Bets",
        url: "https://codeforces.com/problemset/problem/1979/C",
      },
      {
        id: "cf-33",
        name: "Find the Different Ones!",
        url: "https://codeforces.com/problemset/problem/1927/D",
      },
    ],
  },
  {
    rating: "1700",
    problems: [
      {
        id: "cf-34",
        name: "Hidden Weights",
        url: "https://codeforces.com/problemset/problem/1980/E",
      },
      {
        id: "cf-35",
        name: "Manhattan Multifocal",
        url: "https://codeforces.com/problemset/problem/1969/C",
      },
    ],
  },
  {
    rating: "1800",
    problems: [
      {
        id: "cf-36",
        name: "Collatz Conjecture",
        url: "https://codeforces.com/problemset/problem/1982/D",
      },
      {
        id: "cf-37",
        name: "XOR Sequences",
        url: "https://codeforces.com/problemset/problem/1979/D",
      },
    ],
  },
  {
    rating: "1900",
    problems: [
      {
        id: "cf-38",
        name: "Card Game",
        url: "https://codeforces.com/problemset/problem/1984/D",
      },
      {
        id: "cf-39",
        name: "Maximize the Root",
        url: "https://codeforces.com/problemset/problem/1976/D",
      },
    ],
  },
  {
    rating: "2000",
    problems: [
      {
        id: "cf-40",
        name: "Tree and Segments",
        url: "https://codeforces.com/problemset/problem/1966/D",
      },
      {
        id: "cf-41",
        name: "Permutation Sorting",
        url: "https://codeforces.com/problemset/problem/1957/E",
      },
    ],
  },
];

export default function ProblemSheets({ user }) {
  const [activeSheet, setActiveSheet] = useState("leetcode");
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [revisionProblems, setRevisionProblems] = useState(new Set());
  const [viewMode, setViewMode] = useState("all");
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [activeRatingTab, setActiveRatingTab] = useState("800");

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`algotrack_sheets_${user.id}`);
    const savedRevision = localStorage.getItem(`algotrack_revision_${user.id}`);
    if (saved) {
      try {
        setCompletedProblems(new Set(JSON.parse(saved)));
      } catch (e) {
        // ignore
      }
    }
    if (savedRevision) {
      try {
        setRevisionProblems(new Set(JSON.parse(savedRevision)));
      } catch (e) {
        // ignore
      }
    }
  }, [user.id]);

  // Save to local storage on change
  const toggleProblem = (id) => {
    setCompletedProblems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      localStorage.setItem(
        `algotrack_sheets_${user.id}`,
        JSON.stringify(Array.from(newSet)),
      );
      return newSet;
    });
  };

  const toggleRevision = (id) => {
    setRevisionProblems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      localStorage.setItem(
        `algotrack_revision_${user.id}`,
        JSON.stringify(Array.from(newSet)),
      );
      return newSet;
    });
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "Easy":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "Medium":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "Hard":
        return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const toggleSection = (index) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  const getSectionProgress = (problems) => {
    let completed = 0;
    problems.forEach((p) => {
      if (completedProblems.has(p.id)) completed++;
    });
    const percentage =
      problems.length > 0 ? Math.round((completed / problems.length) * 100) : 0;
    return { completed, total: problems.length, percentage };
  };

  // Overall calculations
  const leetcodeProbs = striverSheetData.flatMap((s) => s.problems);
  const codeforcesProbs = cp31SheetData.flatMap((s) => s.problems);
  const lcProgress = getSectionProgress(leetcodeProbs);
  const cfProgress = getSectionProgress(codeforcesProbs);

  return (
    <div className="space-y-6 animate-fade-in" id="problem-sheets">
      {/* Header and Switches */}
      <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-orange-500">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-orange-500" />
            Curated Problem Sheets
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Track your progress on top coding interview and competitive
            programming sheets.
          </p>
        </div>

        <div className="flex bg-black/30 p-1.5 rounded-xl border border-white/5 shadow-inner">
          <button
            onClick={() => setActiveSheet("leetcode")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSheet === "leetcode"
                ? "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md shadow-orange-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Code2 className="h-4 w-4" />
            LeetCode Sheet
          </button>
          <button
            onClick={() => setActiveSheet("codeforces")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSheet === "codeforces"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Cpu className="h-4 w-4" />
            Codeforces Sheet
          </button>
        </div>
      </div>

      {activeSheet === "leetcode" && (
        <div className="space-y-6">
          {/* Status Bar */}
          <div className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="transparent"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="transparent"
                    stroke="#f97316"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={176}
                    strokeDashoffset={176 - (176 * lcProgress.percentage) / 100}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                  {lcProgress.percentage}%
                </div>
              </div>
              <div>
                <h3 className="text-slate-200 font-bold">Overall Progress</h3>
                <p className="text-sm font-mono text-slate-400">
                  {lcProgress.completed} / {lcProgress.total} Solved
                </p>
              </div>
            </div>

            <div className="flex bg-black/30 p-1.5 rounded-xl border border-white/5">
              <button
                onClick={() => setViewMode("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  viewMode === "all"
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All Problems
              </button>
              <button
                onClick={() => setViewMode("revision")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  viewMode === "revision"
                    ? "bg-orange-500/20 text-orange-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Star
                  className={`h-3.5 w-3.5 ${viewMode === "revision" ? "fill-orange-400" : ""}`}
                />
                Revision
              </button>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            {striverSheetData.map((section, sId) => {
              const filteredProblems = section.problems.filter(
                (p) => viewMode === "all" || revisionProblems.has(p.id),
              );
              if (filteredProblems.length === 0) return null;

              const prog = getSectionProgress(section.problems);
              const isExpanded = expandedSections.has(sId);
              return (
                <div
                  key={sId}
                  className="border-b last:border-b-0 border-white/5"
                >
                  <div
                    onClick={() => toggleSection(sId)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-orange-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-500 group-hover:text-slate-300" />
                      )}
                      <h3 className="text-[15px] font-semibold text-slate-200 group-hover:text-white transition-colors">
                        {section.topic}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-24 h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                          style={{ width: `${prog.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-slate-400 min-w-[50px] text-right">
                        {prog.completed} / {prog.total}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-black/20 p-2">
                      <div className="space-y-1">
                        {filteredProblems.map((prob, idx) => {
                          const isCompleted = completedProblems.has(prob.id);
                          const isRevision = revisionProblems.has(prob.id);
                          return (
                            <div
                              key={prob.id}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isCompleted ? "bg-emerald-500/5 border-emerald-500/10" : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"}`}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleProblem(prob.id)}
                                  className="shrink-0 transition-transform active:scale-90"
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-slate-500 hover:text-orange-400 transition-colors" />
                                  )}
                                </button>
                                <span className="text-slate-500 font-mono text-xs w-6">
                                  {idx + 1}.
                                </span>
                                <a
                                  href={prob.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-sm font-medium transition-colors hover:underline flex items-center gap-1.5 ${isCompleted ? "text-slate-400 line-through" : "text-slate-200"}`}
                                >
                                  {prob.name}
                                  <ExternalLink className="h-3 w-3 text-slate-500" />
                                </a>
                              </div>
                              <div className="flex flex-row items-center gap-3">
                                <button
                                  onClick={() => toggleRevision(prob.id)}
                                  className="shrink-0 transition-transform active:scale-90 p-1 hover:bg-white/5 rounded-md"
                                >
                                  <Star
                                    className={`h-4 w-4 ${isRevision ? "fill-orange-400 text-orange-400" : "text-slate-600 hover:text-slate-300"}`}
                                  />
                                </button>
                                <button className="shrink-0 p-1 hover:bg-white/5 rounded-md">
                                  <FileText className="h-4 w-4 text-slate-600 hover:text-slate-300 cursor-pointer" />
                                </button>
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border min-w-[65px] text-center ${getDifficultyColor(prob.difficulty)}`}
                                >
                                  {prob.difficulty}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSheet === "codeforces" && (
        <div className="space-y-6">
          {/* CP31 Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="transparent"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="transparent"
                      stroke="#0ea5e9"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={176}
                      strokeDashoffset={
                        176 - (176 * cfProgress.percentage) / 100
                      }
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-cyan-400">
                    {cfProgress.percentage}%
                  </div>
                </div>
                <div>
                  <h3 className="text-slate-200 font-bold">Overall Progress</h3>
                  <p className="text-sm font-mono text-cyan-400/80">
                    {cfProgress.completed} / {cfProgress.total} Solved
                  </p>
                </div>
              </div>
              <div className="flex bg-black/30 p-1.5 rounded-xl border border-white/5">
                <button
                  onClick={() => setViewMode("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    viewMode === "all"
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  All Problems
                </button>
                <button
                  onClick={() => setViewMode("revision")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    viewMode === "revision"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Star
                    className={`h-3.5 w-3.5 ${viewMode === "revision" ? "fill-cyan-400" : ""}`}
                  />
                  Revision
                </button>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col justify-center">
              <h3 className="text-slate-200 font-bold flex items-center gap-2 mb-2">
                <BarChart className="h-4 w-4 text-cyan-400" /> Rating Tiers
              </h3>
              <div className="flex flex-wrap gap-2">
                {cp31SheetData.slice(0, 5).map((s) => (
                  <div
                    key={s.rating}
                    className="h-2 flex-1 rounded-full bg-black/40 overflow-hidden"
                  >
                    <div
                      className="h-full bg-cyan-400"
                      style={{
                        width: `${getSectionProgress(s.problems).percentage}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rating Tabs row */}
          <div className="glass-card p-3">
            <div className="flex items-center gap-2 overflow-x-auto hidden-scrollbar pb-1">
              <span className="text-slate-400 text-xs font-semibold mr-2 shrink-0">
                Rating
              </span>
              {cp31SheetData.map((section) => {
                const isSelected = activeRatingTab === section.rating;
                const prog = getSectionProgress(section.problems);
                const isComplete =
                  prog.completed === prog.total && prog.total > 0;
                return (
                  <button
                    key={section.rating}
                    onClick={() => setActiveRatingTab(section.rating)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                        : isComplete
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-transparent text-slate-400 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    {section.rating}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target List */}
          <div className="glass-card overflow-hidden">
            <div className="bg-black/30 px-6 py-3 border-b border-white/5 flex grid grid-cols-[auto_1fr_auto] gap-4 items-center">
              <span className="text-xs font-semibold text-slate-500 w-8 text-center">
                Status
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Problem Name
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Actions
              </span>
            </div>

            {cp31SheetData
              .find((s) => s.rating === activeRatingTab)
              ?.problems.filter(
                (p) => viewMode === "all" || revisionProblems.has(p.id),
              )
              .map((prob, idx) => {
                const isCompleted = completedProblems.has(prob.id);
                const isRevision = revisionProblems.has(prob.id);
                return (
                  <div
                    key={prob.id}
                    className={`grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4 border-b last:border-b-0 border-white/5 transition-all hover:bg-white/5 ${isCompleted ? "bg-emerald-500/5" : ""}`}
                  >
                    <div className="w-8 flex justify-center">
                      <button
                        onClick={() => toggleProblem(prob.id)}
                        className="transition-transform active:scale-90"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-slate-600 hover:text-cyan-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-mono text-sm">
                        {idx + 1}.
                      </span>
                      <a
                        href={prob.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium transition-colors hover:underline flex items-center gap-2 ${isCompleted ? "text-slate-400 line-through" : "text-slate-200"}`}
                      >
                        {prob.name}
                        <ExternalLink className="h-3 w-3 text-slate-500" />
                      </a>
                    </div>

                    <div className="flex gap-3 text-slate-500">
                      <button
                        onClick={() => toggleRevision(prob.id)}
                        className="p-1.5 transition-colors bg-white/5 rounded-md hover:bg-white/10"
                      >
                        <Star
                          className={`h-4 w-4 ${isRevision ? "fill-cyan-400 text-cyan-400" : "hover:text-cyan-400"}`}
                        />
                      </button>
                      <button className="p-1.5 hover:text-cyan-400 transition-colors bg-white/5 rounded-md hover:bg-cyan-500/10">
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
