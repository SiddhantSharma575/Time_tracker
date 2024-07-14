import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomButton from "../components/custom-button";
import { formatTime, formatTodayTime } from "../utils";
import { ProjectInterface } from "../types/project-interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setTimer } from "../redux/slices/globalTimer";
import { setCourseProjects } from "../redux/slices/projectsSlice";
import { Colors } from "../constants/Colors";

export default function Index() {
  const fetchedprojects = useSelector(
    (state: RootState) => state.projects.projects
  );
  const timer = useSelector((state: RootState) => state.globalTimer);
  const dispatch = useDispatch();

  const [projects, setProjects] = useState<ProjectInterface[]>(fetchedprojects);
  const [selectedCourse, setSelectedCourse] = useState<string>(
    fetchedprojects[0].title
  );
  const [selectedCourseId, setSelectedCourseId] = useState<number>(
    timer.currentSelectedProjected
  );
  const [seconds, setSeconds] = useState<number>(timer.currentTime);
  const [intervalId, setIntervalId] = useState<
    NodeJS.Timeout | string | number | undefined
  >(undefined);

  const calculateElapsedTime = () => {
    if (timer.isRunning) {
      const startTime = projects.filter(
        (project) => project.id === selectedCourseId
      )[0].startTime;
      const trackedTime = projects.filter(
        (project) => project.id === selectedCourseId
      )[0].trackedTime;
      const startTimeDate = new Date(startTime);
      const currentTime = new Date();
      const elapsedTime = Math.floor(
        (currentTime.getTime() - startTimeDate.getTime()) / 1000
      );
      dispatch(
        setTimer({
          ...timer,
          currentTime: elapsedTime,
        })
      );
      setSeconds(elapsedTime);
      const updatedProjects = projects.map((project) => {
        if (project.id === selectedCourseId) {
          return { ...project, trackedTime: elapsedTime };
        } else {
          return { ...project };
        }
      });
      dispatch(setCourseProjects(updatedProjects));
    }
  };

  useEffect(() => {
    calculateElapsedTime();
  }, []);

  useEffect(() => {
    setProjects(fetchedprojects);
    setSelectedCourseId(timer.currentSelectedProjected);
    setSeconds(timer.currentTime);
  }, [fetchedprojects, timer]);

  const startTimer = () => {
    dispatch(
      setTimer({
        isRunning: true,
        currentTime: seconds,
        currentSelectedProjected: selectedCourseId,
      })
    );
    const updatedProjects = projects.map((project) => {
      if (project.id === selectedCourseId) {
        return { ...project, startTime: new Date().toISOString() };
      } else {
        return { ...project };
      }
    });
    dispatch(setCourseProjects(updatedProjects));
  };

  const stopTimer = () => {
    dispatch(
      setTimer({
        isRunning: false,
        currentTime: projects.filter(
          (project) => project.id === selectedCourseId
        )[0].trackedTime,
        currentSelectedProjected: selectedCourseId,
      })
    );
    dispatch(setCourseProjects(projects));
  };

  const handleSwitchProject = (
    newProjectTitle: string,
    newProjectId: number
  ) => {
    dispatch(setCourseProjects(projects));

    dispatch(
      setTimer({
        isRunning: false,
        currentTime: projects.filter(
          (project) => project.id === newProjectId
        )[0].trackedTime,
        currentSelectedProjected: newProjectId,
      })
    );

    setSeconds(0);
    setSelectedCourse(newProjectTitle);
    setSelectedCourseId(newProjectId);
  };

  useEffect(() => {
    if (timer.isRunning) {
      const id = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
        setProjects((prevProjects) =>
          prevProjects.map((project) => {
            if (project.id === timer.currentSelectedProjected) {
              return {
                ...project,
                trackedTime: project.trackedTime + 1,
              };
            }
            return project;
          })
        );
      }, 1000);
      setIntervalId(id);
    } else if (!timer.isRunning && intervalId) {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timer.isRunning, timer.currentSelectedProjected]);

  const totalTrackedTime = projects.reduce(
    (total, project) => total + project.trackedTime,
    0
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#538AE5" />
        <View style={styles.topTimeContainer}>
          <Text style={styles.timelineText}>Timeline</Text>
          <View style={styles.topInnerContainer}>
            <View style={styles.leftContainer}>
              <Picker
                selectedValue={selectedCourse}
                onValueChange={(itemValue, itemIndex) => {
                  console.log("ITEMVALUE", itemValue);
                  handleSwitchProject(itemValue, itemIndex);
                }}
                mode="dropdown"
                style={styles.pickerContainer}
                dropdownIconColor="#FFF"
                selectionColor="#fff"
                itemStyle={styles.pickerContainer}
              >
                {projects.map((project) => (
                  <Picker.Item
                    key={project.id}
                    label={project.title}
                    value={project.title}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.globalTime}>{formatTime(seconds)}</Text>
              {timer.isRunning ? (
                <FontAwesome
                  name="pause"
                  size={32}
                  color="#FFF"
                  onPress={stopTimer}
                />
              ) : (
                <FontAwesome
                  name="play"
                  size={32}
                  color="#FFF"
                  onPress={startTimer}
                />
              )}
            </View>
          </View>
        </View>
        <View style={styles.bottomTimeContainer}>
          <View style={styles.bottomTimeHeadlineContainer}>
            <Text style={styles.todayText}>Today</Text>
            <Text style={styles.totalTimeText}>
              {formatTodayTime(totalTrackedTime)}
            </Text>
          </View>
          <View>
            {projects.map((project, index) => (
              <Pressable
                key={project.id}
                style={[
                  styles.singleProjectContainer,
                  project.id === timer.currentSelectedProjected &&
                    styles.selectedProjectContainer,
                ]}
                onPress={() => handleSwitchProject(project.title, project.id)}
              >
                <Text style={styles.projectText}>{project.title}</Text>
                <View style={styles.innerItemContainer}>
                  <FontAwesome name="play" size={16} color="#ccc" />
                  <Text style={[styles.projectText, { marginLeft: 8 }]}>
                    {formatTime(project.trackedTime)}
                  </Text>
                </View>
                {index !== 2 &&
                  project.id !== timer.currentSelectedProjected && (
                    <View style={styles.horizontalLine} />
                  )}
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.bottomBtnContainer}>
            <CustomButton
              icon={timer.isRunning ? "pause" : "play"}
              onPress={timer.isRunning ? stopTimer : startTimer}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },
  topTimeContainer: {
    padding: 16,
  },
  timelineText: {
    color: Colors.light.white,
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    letterSpacing: 0.4,
  },
  topInnerContainer: {
    flexDirection: "row",
    width: "100%",
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  pickerContainer: {
    color: Colors.light.white,
    fontSize: 16,
  },
  globalTime: {
    marginBottom: 8,
    color: Colors.light.white,
    fontSize: 32,
  },
  bottomTimeContainer: {
    flex: 1,
    backgroundColor: Colors.light.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    justifyContent: "space-around",
  },
  bottomTimeHeadlineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todayText: {
    color: Colors.light.black,
    fontSize: 32,
    letterSpacing: 0.4,
  },
  totalTimeText: {
    color: Colors.light.black,
    fontSize: 18,
    letterSpacing: 0.4,
  },
  singleProjectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  innerItemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalLine: {
    position: "absolute",
    backgroundColor: Colors.light.grey,
    height: 2,
    bottom: 0,
    left: 0,
    right: 0,
  },
  projectText: {
    fontSize: 16,
    color: Colors.light.black,
    letterSpacing: 0.4,
  },
  selectedProjectContainer: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
    borderRadius: 20,
  },
  bottomBtnContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
