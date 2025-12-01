import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";
import { createPost, getAllCategories, Category } from "../../services/postService";
import { colors } from "../../theme";
import { useI18n } from "../../hooks/useI18n";
import KeyboardAvoidingWrapper from "../../components/KeyboardAvoidingWrapper";

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
  const richEditorRef = useRef<RichEditor>(null);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [thumbnail, setThumbnail] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Cần quyền truy cập", "Vui lòng cấp quyền truy cập thư viện ảnh");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setThumbnail(result.assets[0]);
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
      const { ToastService } = require("../../services/toastService");
      ToastService.error("❌ Lỗi", "Không thể chọn ảnh");
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate
      if (!title.trim()) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('validation.required', { field: t('post.title') }), t('post.validation.titleRequired'));
        return;
      }
      if (!excerpt.trim()) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('validation.required', { field: t('post.excerpt') }), t('post.validation.excerptRequired'));
        return;
      }
      if (!content.trim()) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('validation.required', { field: t('post.content') }), t('post.validation.contentRequired'));
        return;
      }
      if (!categoryId) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('validation.required', { field: t('post.category') }), t('post.validation.categoryRequired'));
        return;
      }
      if (!thumbnail) {
        const { ToastService } = require("../../services/toastService");
        ToastService.warning(t('validation.required', { field: t('post.thumbnail') }), t('post.validation.thumbnailRequired'));
        return;
      }

      setLoading(true);

      // Create FormData
      const formData: any = new FormData();
      
      // Add post data as JSON - must be sent as a file/blob in multipart
      const postData = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        categoryId: categoryId,
      };
      
      // Create a file-like object for JSON part
      const jsonBlob = {
        uri: 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(postData)),
        type: 'application/json',
        name: 'post.json'
      };
      
      formData.append("post", jsonBlob);

      // Add thumbnail - React Native requires specific format
      const uriParts = thumbnail.uri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append("thumbnail", {
        uri: thumbnail.uri,
        name: `thumbnail.${fileType}`,
        type: `image/${fileType}`,
      });
      
      console.log("📦 FormData being sent:", {
        post: postData,
        thumbnailUri: thumbnail.uri,
        thumbnailType: `image/${fileType}`
      });

      const response = await createPost(formData);

      if (response.status === 201) {
        const { ToastService } = require("../../services/toastService");
        ToastService.success(t('common.success'), t('post.createSuccess'));
        navigation.goBack();
      }
    } catch (error: any) {
      console.error("Lỗi khi tạo bài viết:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      const msg = error.response?.data?.message || "Không thể tạo bài viết. Vui lòng thử lại.";
      const { ToastService } = require("../../services/toastService");
      ToastService.error("❌ Lỗi", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>

          <Text
            style={styles.headerTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {t('post.createNewPost')}
          </Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Card: Thông tin bài viết */}
          <View style={styles.card}>

            <Text style={styles.label}>
              {t('post.title')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              placeholderTextColor={"#999"}
              style={styles.input}
              placeholder={t('post.titlePlaceholder')}
              value={title}
              onChangeText={setTitle}
              maxLength={255}
            />

            <Text style={styles.label}>
              {t('post.excerpt')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              placeholderTextColor={"#999"}
              style={[styles.input, styles.textArea]}
              placeholder={t('post.excerptPlaceholder')}
              value={excerpt}
              onChangeText={setExcerpt}
              multiline
              numberOfLines={3}
              maxLength={1000}
            />
            <Text style={styles.charCount}>{excerpt.length}/1000</Text>

            <Text style={styles.label}>
              {t('post.category')} <Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              data={categories.map((cat) => ({ label: cat.title, value: cat.id }))}
              labelField="label"
              valueField="value"
              placeholder={t('post.selectCategory')}
              value={categoryId}
              onChange={(item) => setCategoryId(item.value)}
            />

            <Text style={styles.label}>
              {t('post.thumbnail')} <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity style={styles.imagePickerBtn} onPress={handlePickImage}>
              {thumbnail ? (
                <Image source={{ uri: thumbnail.uri }} style={styles.thumbnailPreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={48} color="#999" />
                  <Text style={styles.imagePickerText}>{t('post.selectThumbnail')}</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>
              {t('post.content')} <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.editorWrapper}>
              <RichToolbar
                editor={richEditorRef}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.alignLeft,
                  actions.alignCenter,
                  actions.alignRight,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.undo,
                  actions.redo,
                ]}
                iconTint="#555"
                selectedIconTint="#007AFF"
                selectedButtonStyle={{ backgroundColor: "#EAF2FF", borderRadius: 6 }}
                style={styles.toolbar}
                iconSize={18}
              />
              <RichEditor
                ref={richEditorRef}
                style={styles.editor}
                placeholder={t('post.contentPlaceholder')}
                initialHeight={250}
                onChange={(text) => setContent(text)}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>{t('post.createPostButton')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f9fafb" 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  iconButton: { 
    padding: 8, 
    borderRadius: 999, 
    backgroundColor: "#f3f4f6", 
    zIndex: 100 
  },
  headerTitle: {
    position: "absolute",
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    paddingLeft: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    paddingVertical: 24,
    marginVertical: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: { 
    fontSize: 20, 
    fontWeight: "600", 
    color: "#1f2937", 
    marginVertical: 8, 
    paddingHorizontal: 16 
  },
  label: { 
    fontSize: 14, 
    fontWeight: "500", 
    marginTop: 16, 
    color: "#374151", 
    paddingHorizontal: 16 
  },
  required: { 
    color: "#ef4444" 
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    height: 52,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
    paddingHorizontal: 16,
  },
  dropdown: {
    height: 52,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  placeholder: {
    color: "#9ca3af",
    fontSize: 16,
  },
  selectedText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "500",
  },
  imagePickerBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    overflow: "hidden",
    minHeight: 200,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  imagePlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
  },
  thumbnailPreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  editorWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  toolbar: {
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 48,
  },
  editor: {
    minHeight: 200,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  submitBtn: {
    backgroundColor: colors.primary.start,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: 1,
    flex: 1,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: { 
    color: "#ffffff", 
    fontWeight: "600", 
    fontSize: 16 
  },
});
