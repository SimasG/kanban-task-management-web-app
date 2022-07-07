**Rationale Behind Building a One-Way Connection between localStorage (LS) & Firestore (FS)**
Initially, I was planning to create a two-way connection between LS & FS. I thought that it would optimize the user experience - the user could use the web app & auto save progress without logging in. As soon as they'd log in, LS data would be ported to FS. If they'd use the app while logged in & then logged out, FS data would be ported to LS & the user experience would be flawless.

_However, there are a couple of issues with this approach:_

1. localStorage is browser-specific.
   If the user is using the app in their specific desktop browser and then they decide to use the app via their phone, they will not have access to their localStorage data. For that to happen, they need to be logged in and store their data in a remote server accessible by any browser.
2. localStorage is user-agnostic
   Two users cannot use the web app via the same browser without their data being mixed up. That's definitely an edge case but it does introduce additional risk.

_That's why I've decided to go with the traditional one-way sync approach. Apart from solving the above-mentioned issues, it also has some advantages._

1. The user is incentivized to become authenticated.
   Positive for creating a relationship with the user & building a sustainable project.
2. Less complicated implementation.
   Since there's less edge cases to be handled, the traditional one-way sync is easier to implement & maintain.
