import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useNavigation } from "@react-navigation/native";
type JobDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EmployeeDetailApplication"
>;
interface IAppliedJobCardProps {
  id: number;
  logo_path: any;
  title: string;
  company_name: string;
  applied_time: string;
  status: string;
  cvUrl: string;
  coverLetter: string
}

const AppliedJobCard = ({
  id,
  title,
  logo_path,
  company_name,
  applied_time,
  status,
  cvUrl,
  coverLetter
}: IAppliedJobCardProps) => {

  const navigation = useNavigation<JobDetailNavigationProp>()
  return (
    <TouchableOpacity style={styles.jobCard} onPress={() =>
      navigation.navigate("EmployeeDetailApplication", { applicationId: id, status: status, cvUrl: cvUrl, coverLetter: coverLetter, jobTitle: title })}>
      <View style={styles.row}>
        {/* Logo công ty */}
        <Image source={
          logo_path
            ? typeof logo_path === "string"
              ? { uri: logo_path }
              : logo_path
            : require("../../assets/App/companyLogoDefault.png")
        } style={styles.logo} />

        {/* Nội dung job */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.company}>{company_name}</Text>
          <View style={styles.bottomRow}>
            <Text style={styles.applied}>Ứng tuyển vào: {applied_time}</Text>
            {/* Icon tin nhắn */}
            <TouchableOpacity>
              <Ionicons name="chatbox-outline" size={20} color="#555" />
            </TouchableOpacity>
          </View>

        </View>

        {/* Icon menu */}
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="black" />
        </TouchableOpacity>
      </View>


    </TouchableOpacity>
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
