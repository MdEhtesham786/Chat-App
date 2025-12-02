import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';


const imageCompressor = async (localImage, localUri) => {
    let manipulatedImage = localImage;
    let manipulatedImageSize;
    console.log('Local Image Size', localImage.size / 1000000);

    if (localImage.size > 50000000) {
        console.log('Image size is greater than 50MB');
        Alert.alert('Image size is too large', 'Please select an image smaller than 50MB');
    } else if (localImage.size > 40000000) {
        console.log('Image size is greater than 40MB');
        manipulatedImage = await ImageManipulator.manipulateAsync(localUri, [], {
            compress: 0.5,
        });
        manipulatedImageSize = await FileSystem.getInfoAsync(manipulatedImage.uri);

        console.log(`📦 Converted image from ${localImage.size / 1000000} to ${manipulatedImageSize.size / 1000000} MB`);
    } else if (localImage.size > 30000000) {
        console.log('Image size is greater than 30MB');
        manipulatedImage = await ImageManipulator.manipulateAsync(localUri, [], {
            compress: 0.6,
        });
        manipulatedImageSize = await FileSystem.getInfoAsync(manipulatedImage.uri);

        console.log(`📦 Converted image from ${localImage.size / 1000000} to ${manipulatedImageSize.size / 1000000} MB`);

    } else if (localImage.size > 20000000) {
        console.log('Image size is greater than 20MB');
        manipulatedImage = await ImageManipulator.manipulateAsync(localUri, [], {
            compress: 0.8,
        });
        manipulatedImageSize = await FileSystem.getInfoAsync(manipulatedImage.uri);

        console.log(`📦 Converted image from ${localImage.size / 1000000} to ${manipulatedImageSize.size / 1000000} MB`);

    } else if (localImage.size > 10000000) {
        console.log('Image size is greater than 10MB');
        manipulatedImage = await ImageManipulator.manipulateAsync(localUri, [], {
            compress: 0.9,
        });
        manipulatedImageSize = await FileSystem.getInfoAsync(manipulatedImage.uri);

        console.log(`📦 Converted image from ${localImage.size / 1000000} to ${manipulatedImageSize.size / 1000000} MB`);

    } else {
        console.log('Image size is less than 10MB hence no compression needed');
    }
    return manipulatedImage.uri;
};

export default imageCompressor;