import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Linking,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useMemo, useState } from "react";
import Back from "@assets/svg/Back";
import MoreIcon from "@assets/svg/More";
import Twitter from "@assets/svg/Twitter";
import LiveIcon from "@assets/svg/LiveIcon";
import Play from "@assets/svg/Play";
import PinIcon from "@assets/svg/PinIcon";

import LabelIcon from "@assets/svg/LabelIcon";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile, followUser, unFollowUser, userFollowers } from "@twikkl/services/profile.services";
import { authEntity } from "@twikkl/entities/auth.entity";
import AppLoader from "@twikkl/components/AppLoader";
import { fetchBookmarks, fetchUserPost, isUserFeedsResponse } from "@twikkl/services/feed.services";
import ImgBgRender from "@twikkl/components/ImgBgRender";
import BigView from "@twikkl/components/Discover/BigView";
import Settings from "@assets/svg/Settings";
import { hideLoader, showLoader } from "@twikkl/entities";

const iconsArr = [{ Icon: Play }, { Icon: PinIcon }, { Icon: LiveIcon }, { Icon: LabelIcon }];

const Profile = () => {
  const router = useRouter();

  const [active, setActive] = useState(0);

  const { userId } = useLocalSearchParams<{ userId: string }>();

  const { user: loggedInUser } = authEntity.get();

  const user = userId || loggedInUser?._id;

  const { data, isLoading } = useQuery(["user-profile", user], () => fetchProfile(user || ""));

  const { data: followers } = useQuery<any>(["user-followers", user], () => userFollowers(user || ""));

  const { data: bookmarks } = useQuery(["user-bookmarks", user], () => fetchBookmarks());

  console.log("====================================");
  console.log("markkk", bookmarks);
  console.log("====================================");
  const [pageSize, setPageSize] = useState(10);

  const { data: userPosts, refetch } = useQuery(["user-posts", user, pageSize], () => fetchUserPost(user || ""));

  const posts = isUserFeedsResponse(userPosts) ? userPosts.data : [];

  const postsPagination = isUserFeedsResponse(userPosts) ? userPosts.pagination : null;

  const handleFollow = async (userId: string) => {
    if (!userId) return;
    showLoader();

    try {
      const data = await followUser(userId);
      console.log({ followData: data });
    } catch (error) {
      console.log({ followError: error });
    } finally {
      hideLoader();
    }
  };

  const handleUnFollow = async (userId: string) => {
    if (!userId) return;
    showLoader();
    try {
      const data = await unFollowUser(userId);
      console.log({ unFollowData: data });
    } catch (error) {
      console.log({ unFollowError: error });
    } finally {
      hideLoader();
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height;

    if (isEndReached && postsPagination && active === 0) {
      if (!isLoading && (postsPagination.total || 0) > pageSize) {
        setPageSize((prev) => prev + 10);
      }
    }
  };

  const loggedInProfile = loggedInUser?._id === user;

  const isFollowingUser = useMemo(() => {
    if (loggedInProfile) return null;
    const isUserFollowed = followers?.data && followers.data.some((follower: any) => follower._id === user);

    return isUserFollowed;
  }, [followers]);

  const [viewPost, setViewPost] = useState<number | null>(null);

  if (isLoading) return <AppLoader />;

  if (viewPost !== null)
    return (
      <BigView
        setBigView={() => setViewPost(null)}
        post={posts[viewPost]}
        refetchComments={() => {
          refetch();
        }}
      />
    );

  const detailsArr = [
    { num: data?.following.length || 0, text: "Followers" },
    { num: followers?.pagination.total || 0, text: "Following" },
    { num: postsPagination?.total || 0, text: "Total Twikks" },
  ];

  console.log({ followers });

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Pressable onPress={router.back}>
          <Back dark="#041105" />
        </Pressable>
        <Text style={styles.boldText}>Profile</Text>
        {loggedInProfile ? (
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Settings />
          </TouchableOpacity>
        ) : (
          <MoreIcon />
        )}
      </View>
      <ScrollView style={{ paddingHorizontal: 10 }} onScroll={handleScroll}>
        <View style={styles.center}>
          <Image source={{ uri: data?.avatar }} style={styles.profileImg} />
          <Text style={styles.boldTextSpace}>{data?.username}</Text>
          <View style={styles.justifyCenter}>
            {detailsArr.map((item) => (
              <View style={styles.textCenter} key={item.text}>
                <Text>{item.num}</Text>
                <Text style={{ fontWeight: "700", marginTop: 3 }}>{item.text}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.textLight}>{data?.bio || "-"}</Text>
          <View style={styles.flex}>
            {loggedInProfile ? (
              <Pressable
                onPress={() => router.push({ pathname: "settings", params: { name: "Account" } })}
                style={styles.bgGreen}
              >
                <Text style={styles.textWhite}>Edit Profile</Text>
              </Pressable>
            ) : isFollowingUser ? (
              <Pressable
                style={styles.bgGreen}
                onPress={() => {
                  handleUnFollow(user as string);
                }}
              >
                <Text style={styles.textWhite}>UnFollow</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.bgGreen}
                onPress={() => {
                  handleFollow(user as string);
                }}
              >
                <Text style={styles.textWhite}>Follow</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.bgGreen}
              onPress={() => (data?.twitter ? Linking.openURL(`https://twitter.com/${data?.twitter}`) : null)}
            >
              <Twitter />
            </Pressable>
          </View>
        </View>
        <View style={styles.wrapper}>
          {iconsArr.map(({ Icon }, index) => (
            <Pressable
              key={index}
              onPress={() => setActive(index)}
              style={[
                active === index ? styles.bgGreen : { backgroundColor: "transparent" },
                { width: "25%", justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Icon dark={active === index ? "#fff" : "#50A040"} />
            </Pressable>
          ))}
        </View>
        <View style={styles.img}>
          {active === 0 &&
            posts &&
            posts.map((post, idx) => (
              <ImgBgRender
                key={post._id}
                img={post.video}
                likes={post.totalLikes}
                handleView={() => setViewPost(idx)}
              />
            ))}
          {/* {active === 1 &&
            bookmarks &&
            bookmarks.data.map((bookmark, idx) => (
              <ImgBgRender
                key={bookmark._id}
                img={post.video}
                likes={post.totalLikes}
                handleView={() => setViewPost(idx)}
              />
            ))} */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
  },
  profileImg: {
    width: 163,
    height: 163,
    borderRadius: 100,
    backgroundColor: "white",
    marginBottom: 16,
  },
  flex: {
    flexDirection: "row",
    gap: 8,
  },
  center: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  justifyCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: "5%",
  },
  container: {
    paddingTop: 60,
    backgroundColor: "#F1FCF2",
    flex: 1,
  },
  boldText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  boldTextSpace: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 4,
  },
  textCenter: {
    alignItems: "center",
  },
  textWhite: {
    fontWeight: "700",
    fontSize: 14,
    color: "#F1FCF2",
  },
  textLight: {
    marginBottom: 8,
    marginTop: 16,
    textAlign: "center",
    fontSize: 12,
  },
  bgGreen: {
    paddingVertical: 10,
    height: 38,
    paddingHorizontal: 20,
    backgroundColor: "#50A040",
    borderRadius: 16,
  },
  img: {
    flexDirection: "row",
    // justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 38,
  },
});
