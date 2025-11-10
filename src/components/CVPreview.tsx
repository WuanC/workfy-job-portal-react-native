import { WebView } from "react-native-webview";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";

const CVPreview = ({ url }: { url: string }) => {
  if (!url) return <Text>Không có tệp đính kèm</Text>;

  const ext = url.split(".").pop()?.toLowerCase();

  // Chọn viewer phù hợp
  let viewerUrl = "";
  if (["pdf"].includes(ext!)) {
    viewerUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`;
  } else if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext!)) {
    viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  } else {
    // fallback (ảnh hoặc loại khác)
    viewerUrl = url;
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: viewerUrl }}
        style={styles.webview}
        startInLoadingState
        nestedScrollEnabled={true}
        renderError={() => (
          <View style={styles.errorContainer}>
            <Text>Không thể xem trước tệp này</Text>
            <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(url)}>
              <Text style={styles.link}>Mở trong trình duyệt</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 500, borderRadius: 8, overflow: "hidden" },
  webview: { flex: 1 },
  errorContainer: { alignItems: "center", justifyContent: "center", padding: 16 },
  link: { color: "#007bff", marginTop: 8 },
});

export default CVPreview;
