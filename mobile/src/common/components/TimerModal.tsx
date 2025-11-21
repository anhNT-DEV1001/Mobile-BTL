import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Modal, Portal, Text, Button, Card } from "react-native-paper";

interface TimerModalProps {
  visible: boolean;
  exerciseId: string | null;
  onClose: () => void;
  onComplete: (id: string | null, seconds: number) => void;
}

export default function TimerModal({ 
  visible, 
  exerciseId, 
  onClose,
  onComplete
}: TimerModalProps) {

  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | number | null>(null);
  const [running, setRunning] = useState(false);

  const startTimer = () => {
    if (running) return;

    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
  };

  const finish = () => {
    stopTimer();
    onComplete(exerciseId, seconds);  // ← trả id + thời gian cho parent
  }

  const formatTime = () => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (!visible) {
      // reset khi modal đóng
      resetTimer();
    }
  }, [visible]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => {
          stopTimer();
          onClose();
        }}
        contentContainerStyle={styles.container}
      >
        <Card style={styles.card}>
          <Card.Title title={`Bấm giờ tập luyện`} />
          <Card.Content>
            <Text style={styles.time}>{formatTime()}</Text>
          </Card.Content>

          <Card.Actions style={styles.actions}>
            {running ? (
              <Button icon="pause" mode="contained-tonal" onPress={stopTimer}>
                Pause
              </Button>
            ) : (
              <Button icon="play" mode="contained" onPress={startTimer}>
                Start
              </Button>
            )}

            <Button icon="restart" mode="outlined" onPress={resetTimer}>
              Reset
            </Button>

            <Button mode="text" onPress={finish}>
              Hoàn thành
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  card: {
    paddingVertical: 20,
  },
  time: {
    fontSize: 48,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    fontWeight: "bold",
  },
  actions: {
    justifyContent: "space-around",
    marginTop: 10,
  },
});
