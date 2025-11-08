import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from "react-native"
import JobCard from "./JobCard"

// Hàm chunk
const chunkArray = (arr: any[], size: number) => {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

const FeaturedJobsSection = ({ featuredJobs }: { featuredJobs: any[] }) => {
  const jobPages = chunkArray(featuredJobs, 4)
  const [currentPage, setCurrentPage] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (containerWidth === 0) return
    const offsetX = event.nativeEvent.contentOffset.x
    const pageIndex = Math.round(offsetX / containerWidth)
    setCurrentPage(pageIndex)
  }

  const onLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width)
  }

  return (
    <View style={styles.section} onLayout={onLayout}>

      {containerWidth > 0 && (
        <FlatList
          data={jobPages}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={{ width: containerWidth, paddingHorizontal: 10 }}>
              {item.map((job: any, idx: number) => (
                <View key={job.id} style={{ marginBottom: 12 }}>
                  {/* <JobCard {...job} /> */}
                  <JobCard
                    id={job.id}
                    logo_path={job.avatarUrl}
                    job_title={job.jobTitle}
                    company_name={job.companyName}
                    job_location={job.jobLocations[0]?.province?.name}
                    salary_range={
                      job.salaryType === "RANGE"
                        ? `${job.minSalary} - ${job.maxSalary} ${job.salaryUnit}`
                        : job.salaryType === "NEGOTIABLE"
                          ? "Thỏa thuận"
                          : "Không rõ"
                    }
                    time_passed={job.expirationDate}
                  />
                </View>
              ))}
            </View>
          )}
        />
      )}

      {/* Indicator */}
      <View style={styles.indicatorContainer}>
        {jobPages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentPage === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginTop: 7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#007AFF",
    width: 10,
    height: 10,
  },
})

export default FeaturedJobsSection
