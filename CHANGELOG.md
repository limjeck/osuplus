## 2.1.2 (29 Sept 2018)

#### Bugfixes
- Fixed beatmap scores displaying incorrect date again
- Fixed user recent scores displaying incorrect date
- Fixed user "show more" top scores not giving full details
- Fixed osuplus overwriting scoreboard country ranking/friend ranking/mod ranking for supporters
- Fixed compatibility with Opera tampermonkey
- Adjusted Beatmaplisting/Subscription tabs in old site

## 2.1.1 (25 Sept 2018)

#### Bugfixes
- Fixed beatmap scores displaying incorrect date

## 2.1.0 (14 Sept 2018)

#### Features
- Added the following features on the new site:
  - Beatmap page:
    - slider to highlight recent scores
    - subscribe map
  - Userpage:
    - display recent plays (including failed scores)
    - detailed top ranks
    - slider to highlight recent top scores
    - beatmaps information on top ranks/recent plays
    - subscribe mapper
  - Performance ranking page:
    - display global and country ranks
  - Beatmaplisting:
    - tab for subscribed maps and mappers

#### Bugfixes
- Fixed userpage not displaying correct stats on recent plays for ctb/mania
- Fixed osuplus not running on unranked beatmaps
- Now works with Firefox Greasemonkey

## 2.0.2 (4 Sept 2018)

#### Features
- Added support for Touch Device mod

#### Bugfixes
- Fixed osuplus failing when there's banned player on leaderboard

## 2.0.1 (3 Sept 2018)

#### Bugfixes
- Fixed recent scores displaying incorrect date

## 2.0.0 (2 Sept 2018)

#### Features
- Added the following features on the new site:
  - Beatmap page:
    - top 100 scores
    - pp 2 decimal places
    - sort by pp
    - selected mods scores
    - friends' scores
    - score date
    - search scores of any user
    - download replay of any score (if available)
    - Bloodcat mirror
    - max combo value
- Added setting to display pp in 0 or 2 dp
- Beatmap score rank will not link to replay if replay is unavailable

## 1.7.0 (27 Sept 2017)

#### Features
- Settings tab on top right to enable/disable osuplus features
- Added link in osu!preview to open in new tab
- Added setting to force show difficulties in beatmap listing

#### Bugfixes
- Fixed Most Played tab

## 1.6.0 (22 June 2017)

#### Features
- Subscription to mappers and maps
- Beatmap information in userpage top ranks/recent plays

## 1.5.7 (25 May 2017)

#### Bugfixes
- Fixed Most Played tab (again)

## 1.5.6 (18 May 2017)

#### Bugfixes
- Fixed rank image not displaying properly (due to ppy moving the image address)

## 1.5.5 (22 Feb 2017)

#### Features
- Display multiple scores (if available) when you search the user in beatmap listings
- Multiple scores by the same player (when multiple mod combinations selected) are now greyed out

## 1.5.4 (8 Feb 2017)

#### Bugfixes
- Fixed top pp scores in userpage displaying incorrect stats if it is not your top score
- Fixed score stats in userpage for CTB (now {300/100/50/droplet miss/miss}) and mania (now {max/300/200/100/50/miss})
- Search user textbox now appears faster

## 1.5.3 (1 Nov 2016)

#### Bugfixes
- Show pp rank checkbox now remembers your choice
- Loads faster (when show pp rank is disabled)
- Fixed most played tab (again)

## 1.5.2 (16 Sept 2016)

#### Bugfixes
- Checkbox to show global/country rank now (and it remembers your choice)
- Fixed global/country rank for Firefox

## 1.5.1 (15 Sept 2016)

#### Bugfixes
- Fixed column headers for search user scores
- Button to show global/country rank (to be compatible with osu!savePP)

## 1.5.0 (12 Sept 2016)

#### Features
- Display pp rank in beatmap listing
- New loading image
- Display global and country rank in performance ranking

#### Bugfixes
- Fixed unchecking highlight not dehighlighting in userpage
- Fixed max combo displaying nullx for Taiko/Mania in userpage (now doesn't display at all, since max combo is not available for Taiko/Mania in the API)

## 1.4.0 (27 May 2016)

#### Features
- Detailed top ranks
- Star rating in most played
- Slider to highlight recent scores in beatmap listing and top ranks

#### Bugfixes
- Fixed most played not working (again)
- Fixed taiko acc calculation

## 1.3.1 (12 May 2016)

#### Bugfixes
- Fixed most played not working

## 1.3.0 (9 May 2016)

#### Features
- osu!mania mods
- Display recent plays (including failed scores) in userpage
- Display top 100 most played maps in userpage
- Display total 300/100/50 hits
- Display hits/play

#### Bugfixes
- Improved performance
- Reduced size of images

## 1.2.1 (15 Feb 2016)

#### Bugfixes
- Now works with Greasemonkey 1.15.1 on Pale Moon

## 1.2.0 (11 Feb 2016)

#### Features
- Mod icons
- Allow fuzzy mod selection (e.g. so you can display scores with DT or HDDT)
- Download replay of any score (if available)
- [osu!preview](https://osu.ppy.sh/forum/t/383371)
- Bolded star difficulty
- Display max combo value
- Images now hard-coded in base64

#### Bugfixes
- No longer displays your name twice in friend ranking if you are your own friend
- No longer displays duplicate scores if you click buttons too fast

## 1.1.0 (18 Jan 2016)

#### Features
- API prompt more obvious
- Sort by pp
- New bloodcat image button (thanks [Dionysaw](https://osu.ppy.sh/u/4294475))
- Show date score is set
- Simple loading label when loading

#### Bugfixes
- Faster on Firefox

## 1.0.3 (14 Jan 2016)

#### Bugfixes
- Now works with Firefox!

## 1.0.2 (14 Jan 2016)

#### Features
- pp now to 2 decimal places

## 1.0.1 (14 Jan 2016)

#### Bugfixes
- Fix inconsistent friend ranking (the API can screw up if you do multiple requests at the same time, or something)

## 1.0 (13 Jan 2016)

#### Features
- Highlight friends
- Display friend rankings
- Search scores of any user

#### Bugfixes
- Fix osu!mania scorelist

## 0.1 (6 Jan 2016)

#### Features
- Displays up to top 100 scores
- Displays pp for each score
- Displays scores according to selected mods
- Bloodcat mirror
- Display numerical value of CS, AR, HP, OD
