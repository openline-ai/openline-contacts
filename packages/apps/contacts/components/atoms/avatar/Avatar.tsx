import React from 'react';
import Image, {ImageProps, StaticImageData} from "next/image";
import styles from "./avatar.module.css";

interface AvatarProps extends ImageProps {
    image?: StaticImageData;
    username: string;
    imageHeight?: number
    imageWidth?: number
}

export const Avatar: React.FC<AvatarProps> = ({ image, username, imageHeight,
                                                  imageWidth, ...rest}) => {
    return image ? (
                    <Image {...rest} src={image} alt={username} height={imageHeight || 40} width={imageWidth} />
            ) : (
                <p>{username}</p>
            )
};

