// const checkForSmallUpdate = async () => {
//     try {
//         const update = await Updates.checkForUpdateAsync();
//         console.log('UPDATE', update);
//         if (update.isAvailable) {
//             Alert.alert("Update Available", "A new version is available. Restart to apply?", [
//                 { text: "Cancel", style: "cancel" },
//                 {
//                     text: "Restart Now",
//                     onPress: async () => {
//                         await Updates.fetchUpdateAsync();
//                         await Updates.reloadAsync(); // Restarts app with the new update
//                     },
//                 },
//             ]);
//         }
//     } catch (error) {
//         console.log("Error checking for updates:", error);
//     }
// };