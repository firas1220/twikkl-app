import {
  StyleSheet,
  TouchableOpacity,
  View,
  ImagePropsBase,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { Text } from "react-native-paper";
import { Video, ResizeMode } from "expo-av";
import { TwikklIcon, EIcon } from "@twikkl/configs";
import { ButtonAddSimple } from "@twikkl/components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLikesHook } from "@twikkl/hooks/likes.hooks";
import { TUser } from "@twikkl/entities/auth.entity";
const DEFAULT_CAMERA_ACTION_COLOR = "#FFF";
const video = require("@assets/videos/ballon.mp4");

//get device width and height
const { width, height } = Dimensions.get("window");

/**
 * TODO - Build Home screen component
 *
 * @constructor
 */

const profileImg = require("@assets/imgs/logos/profile.png") as ImagePropsBase["source"];

type Props = {
  item: {
    video: string;
    likes: { user: TUser }[];
    _id: string;
    description: string;
    creator: TUser;
  };
  index: number;
  visibleIndex: number;
  onShareClick: any;
  bigView?: boolean;
};

export default function VideoFeedItem({ item, index, visibleIndex, onShareClick, bigView }: Props) {
  const router = useRouter();

  const { toggleLikePost, liked } = useLikesHook(item.likes, item._id);

  const icons = () => {
    const options = [
      {
        icon: EIcon.HEART,
        color: liked ? "red" : DEFAULT_CAMERA_ACTION_COLOR,
        action: () => toggleLikePost(),
      },
      {
        color: DEFAULT_CAMERA_ACTION_COLOR,
        icon: EIcon.THUMB_DOWN,
        action: () => null,
      },
      {
        icon: EIcon.SHARE_NETWORK,
        color: DEFAULT_CAMERA_ACTION_COLOR,
        action: () => onShareClick(),
      },
      {
        icon: EIcon.PIN,
        color: DEFAULT_CAMERA_ACTION_COLOR,
        action: () => null,
      },
    ];
    if (bigView)
      options.unshift({
        color: DEFAULT_CAMERA_ACTION_COLOR,
        icon: EIcon.COMMENT,
        action: () => null,
      });
    return options;
  };

  const [shouldPlay, setShouldPlay] = useState(false);

  const { t } = useTranslation();

  //set play state
  useEffect(() => {
    setShouldPlay(index === visibleIndex);
    // router.push("video/CreateUploadVideo");
  }, [visibleIndex]);

  const togglePlay = () => {
    setShouldPlay(!shouldPlay);
  };

  return (
    <TouchableWithoutFeedback onPress={togglePlay} style={{ flex: 1 }}>
      <View style={{ flex: 1, height }}>
        <Video
          source={video}
          shouldPlay={shouldPlay}
          isLooping
          resizeMode={ResizeMode.COVER}
          style={[StyleSheet.absoluteFill]}
        />
        <View style={styles.bottomContainer}>
          <View style={styles.rightActionsContainer}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {icons().map((icon, index) => (
                <TouchableOpacity
                  onPress={() => icon.action()}
                  key={index}
                  style={{
                    paddingVertical: 12,
                  }}
                >
                  <TwikklIcon name={icon.icon} size={24} color={icon.color} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 14,
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Image style={styles.profileImg} source={profileImg} />
              <Text variant="titleMedium" style={[styles.headActionText, { width: "75%" }]}>
                @{item.creator.username} {"\n"}
                <Text variant="bodyLarge" style={{ color: DEFAULT_CAMERA_ACTION_COLOR }}>
                  {item.description}
                </Text>
              </Text>
            </View>
            {!bigView && (
              <TouchableOpacity onPress={() => router.push("video/CreateUploadVideo")}>
                <ButtonAddSimple />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  headActionText: {
    color: DEFAULT_CAMERA_ACTION_COLOR,
    fontWeight: "600",
  },
  headActionIndicator: {
    alignSelf: "center",
    marginTop: 0,
    paddingHorizontal: 10,
    paddingVertical: 3,
    height: 5,
  },
  rightActionsContainer: {
    justifyContent: "space-between",
    alignSelf: "flex-end",
    alignItems: "flex-end",
    marginVertical: 10,
    paddingRight: 5,
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#FFF",
  },
  bottomContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: "20%",
    justifyContent: "flex-end",
  },
});
