REM Extract all skill icons
.\UnityAssets.exe -r C:\Users\Owner\AppData\Local\Plarium\PlariumPlay\StandAloneApps\raid -o S:\RaidExtractor\Zerfl\ExtractedAssets\skillIcons -a resources,*/Raid_Data/StreamingAssets/AssetBundles -b SkillIcons*

REM Extract all hero avatars
.\UnityAssets.exe -r C:\Users\Owner\AppData\Local\Plarium\PlariumPlay\StandAloneApps\raid -o S:\RaidExtractor\Zerfl\ExtractedAssets\heroAvatars -a resources,*/Raid_Data/StreamingAssets/AssetBundles -b HeroAvatars*

REM Extract Status Effect Icons
.\UnityAssets.exe -r C:\Users\Owner\AppData\Local\Plarium\PlariumPlay\StandAloneApps\raid -o S:\RaidExtractor\Zerfl\ExtractedAssets\statusEffectIcons -a resources,*/Raid_Data/StreamingAssets/AssetBundles -b *StatusEffectIcons*

REM Extract some other stuff
.\UnityAssets.exe -r C:\Users\Owner\AppData\Local\Plarium\PlariumPlay\StandAloneApps\raid -o S:\RaidExtractor\Zerfl\ExtractedAssets\otherStuff -a resources,*/Raid_Data/StreamingAssets/AssetBundles -b *UIShared*


echo %ERRORLEVEL%
pause



REM For Adding to build process...

REM    "prestart": "./UnityAssets/UnityAssets.exe -r C:/Users/Owner/AppData/Local/Plarium/PlariumPlay/StandAloneApps/raid -o https://ik.imagekit.io/raidchamps/otherStuff -a resources,*/Raid_Data/StreamingAssets/AssetBundles -b *UIShared*",
REM    "prestart": "./UnityAssets/UnityAssets.exe -r C:/Users/Owner/AppData/Local/Plarium/PlariumPlay/StandAloneApps/raid -o https://ik.imagekit.io/raidchamps/skillIcons -a resources,*/Raid_Data/StreamingAssets/AssetBundles -b SkillIcons*",
REM    "prestart": "./UnityAssets/UnityAssets.exe -r C:/Users/Owner/AppData/Local/Plarium/PlariumPlay/StandAloneApps/raid -o https://ik.imagekit.io/raidchamps/statusEffectIcons -a resources,*/Raid_Data/StreamingAssets/AssetBundles -b *StatusEffectIcons*",
REM    "prestart": "./UnityAssets/UnityAssets.exe -r C:/Users/Owner/AppData/Local/Plarium/PlariumPlay/StandAloneApps/raid -o https://ik.imagekit.io/raidchamps/heroAvatars -a resources,*/Raid_Data/StreamingAssets/AssetBundles -b HeroAvatars*",
REM    "prestart": "./UnityAssets/UnityAssets.exe -r C:/Users/Owner/AppData/Local/Plarium/PlariumPlay/StandAloneApps/raid -o https://ik.imagekit.io/raidchamps/heroAvatars -a resources,*/Raid_Data/StreamingAssets/AssetBundles -b HeroAvatars*",
REM    "prestart": "./UnityAssets/UnityAssets.exe -r C:/Users/Owner/AppData/Local/Plarium/PlariumPlay/StandAloneApps/raid -o https://ik.imagekit.io/raidchamps/heroAvatars -a resources,*/Raid_Data/StreamingAssets/AssetBundles -b HeroAvatars*",