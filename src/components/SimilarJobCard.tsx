import { TouchableOpacity, View, Text, Switch, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";


interface ISimilarJobCardProps {
    id: string,
    title: string,
    location: string,
    notificationState: boolean
}


const SimilarJobCard = ({ id, title, location, notificationState }: ISimilarJobCardProps) => {
    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => setIsEnabled((prev) => !prev);
    useEffect(() => {
        setIsEnabled(notificationState)
    }, []);
    return (
        <View style={styles.jobCard}>
            <View style={styles.row}>
                <Text style={styles.jobText}>
                    Việc tương tự của: <Text style={styles.link}>{title}</Text>
                </Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.jobRow}>
                <Text style={styles.location}>{location}</Text>
                <Switch value={isEnabled} onValueChange={toggleSwitch} />
            </View>
        </View>
    );
}
export default SimilarJobCard;
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
        marginBottom: 6,
        paddingRight: 25
    },

    jobText: {
        fontSize: 20,
        marginBottom: 2,
        marginRight: 15,
    },
    link: {
        color: "#0066CC",
        fontWeight: "bold",
    },
    jobRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    location: {
        fontSize: 16,
        color: "#777",
    },
})