import Notification from "../models/notification.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

// get user profile
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getUserProfile: ", error.message);
  }
};

// follow Unfollow User
export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id.toString();

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    console.log(userToModify, currentUser);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }
    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: id } });
      // TODO return the id of the user as a response
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // follow the user
      await User.findByIdAndUpdate(id, { $push: { followers: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $push: { following: id } });
      // send notification to user

      const newNotification = new Notification({
        type: "follow",
        from: currentUserId,
        to: userToModify._id,
      });

      await newNotification.save();
      // TODO return the id of the user as a response
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.error("Error in followUnfollowUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// suggested user
export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestUsers = filteredUsers.slice(0, 4);

    //set password null for suggest user
    suggestUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestUsers);
  } catch (error) {}
};

// Update Users
export const updateUser = async (req, res) => {
  const { fullName, eamil, username, currentPassword, newPassword, big, link } =
    req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (user) return res.status(404).json({ message: "User not found" });

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res
        .status(400)
        .json({ message: "Plz provide both current and new password" });
    }
    // matching password
    if (newPassword && currentPassword) {
      const isMatched = await bcrypt.compare(currentPassword, user.password);
      if (!isMatched)
        return res.status(400).json({ error: "Current Password is incorrect" });
      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ error: "Password must be at least 6 charerter long" });

      // new password update
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
  } catch (error) {}
};
