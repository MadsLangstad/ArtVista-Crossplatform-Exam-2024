export interface EditProfileModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  saveProfile: (profile: {
    username: string;
    bio: string;
    profileImageUrl: string;
  }) => void;
}

export interface ImagePickerModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  pickImageFromLibrary: () => void;
  takeImageWithCamera: () => void;
}

export interface ProfileHeaderProps {
  refresh: boolean;
}
