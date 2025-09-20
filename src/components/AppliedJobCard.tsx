import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IAppliedJobCardProps {
  id: string;
  logo_path: any;
  title: string;
  company_name: string;
  readState: boolean;
  applied_time: string;
}

const AppliedJobCard = ({
  id,
  title,
  logo_path,
  company_name,
  readState,
  applied_time,
}: IAppliedJobCardProps) => {
  return (
    <View style={styles.jobCard}>
      <View style={styles.row}>
        {/* Logo công ty */}
        <Image source={logo_path} style={styles.logo} />

        {/* Nội dung job */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.company}>{company_name}</Text>
          <Text style={styles.applied}>Ứng tuyển vào: {applied_time}</Text>
        </View>

        {/* Icon menu */}
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        {/* Tag trạng thái đọc/chưa đọc */}
        {!readState && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>Chưa đọc</Text>
          </View>
        )}
        {readState && (
          <View style={[styles.tag, { backgroundColor: "#e0f7e9" }]}>
            <Text style={[styles.tagText, { color: "#2e7d32" }]}>Đã đọc</Text>
          </View>
        )}

        {/* Icon tin nhắn */}
        <TouchableOpacity>
          <Ionicons name="chatbox-outline" size={20} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppliedJobCard;

const styles = StyleSheet.create({
  jobCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
    marginTop: 10
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  applied: {
    fontSize: 13,
    color: "#777",
  },
  bottomRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginLeft: 40
  },
  tagText: {
    fontSize: 12,
    color: "#333",
  },
});
