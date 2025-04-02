import React, { useEffect, useState } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { TimerProps } from '../../types';
import {
    initializeNotifications,
    showNotification,
} from '../../utils/notifications';
import { Notification } from '../Notification';
import styles from './Timer.module.css';
import { TimerControls } from './TimerControls';
import { TimerDisplay } from './TimerDisplay';
import { tasksDB } from '../../utils/database';
import {
    TIMER_TYPES,
    COMPLETION_MESSAGES,
    ERROR_MESSAGES,
    TIMER_TITLES,
} from '../../constants/timerConstants';

export const Timer: React.FC<TimerProps> = ({
    selectedTask,
    onTaskComplete,
}) => {
    const [notification, setNotification] = useState<string | null>(null);

    const {
        timeLeft,
        start,
        pause,
        reset,
        timerType,
        sessionsCompleted,
        hasStarted,
        isRunning,
        switchTimer,
        settings,
    } = useTimer({
        onComplete: async (type) => {
            if (type === TIMER_TYPES.WORK) {
                await handleDone();
                showNotification(type);
                setNotification(COMPLETION_MESSAGES[type]);
            }
        },
    });

    const canStartWorkTimer = selectedTask !== null;

    const handleStart = () => {
        start();
    };

    const handlePause = () => {
        pause();
    };

    const handleResume = () => {
        start();
    };

    const handleStop = () => {
        reset();
    };

    const handleSkip = () => {
        switchTimer();
    };

    const showInAppNotification = (message: string) => {
        setNotification(message);
    };

    const handleDone = async () => {
        if (!selectedTask) return;

        // Calculate actual duration based on time spent
        const totalDurationMs = settings.workDuration * 1000; // Full duration in ms
        const timeLeftMs = timeLeft * 1000; // Remaining time in ms
        const actualDurationMs = hasStarted ? totalDurationMs - timeLeftMs : totalDurationMs;

        const completedTask = {
            ...selectedTask,
            id: `completed-${selectedTask.id}-${Date.now()}`,
            endTime: Date.now(),
            duration: actualDurationMs,
            completed: true,
            pomodoros: 1,
        };

        console.log('Attempting to complete pomodoro:', {
            taskId: selectedTask.id,
            completedTask,
            actualDuration: `${Math.round(actualDurationMs / 60000)}m`,
            timeSpent: hasStarted ? `${Math.round((totalDurationMs - timeLeftMs) / 60000)}m` : 'none',
        });

        try {
            await tasksDB.completeOnePomodoro(selectedTask.id, completedTask);
            console.log('Pomodoro completed successfully');
            await onTaskComplete();
            showInAppNotification(COMPLETION_MESSAGES[timerType]);
        } catch (error) {
            console.error('Failed to complete task:', error);
            showInAppNotification(ERROR_MESSAGES.TASK_COMPLETE_FAILED);
        }
    };

    useEffect(() => {
        initializeNotifications();
    }, []);

    const getTimerTitle = () => {
        const session = Math.floor(sessionsCompleted) + 1;
        const title = TIMER_TITLES[timerType];
        return typeof title === 'function' ? title(session) : title;
    };

    return (
        <>
            <div className={`${styles.timerContainer} ${styles[timerType]}`}>
                <div className={styles.timerHeader}>
                    <div className={styles.headerLeft}>
                        <span>⚙️</span>
                        <span>📋</span>
                    </div>
                    <div>{getTimerTitle()}</div>
                    <div>❌</div>
                </div>
                <div className={styles.timerDisplay}>
                    <TimerDisplay timeLeft={timeLeft} />
                </div>
                <div className={styles.taskName}>
                    {selectedTask
                        ? selectedTask.description
                        : 'No task selected'}
                </div>
                <TimerControls
                    isPaused={!isRunning && hasStarted}
                    hasStarted={hasStarted}
                    onStart={handleStart}
                    onResume={handleResume}
                    onPause={handlePause}
                    onStop={handleStop}
                    onDone={handleDone}
                    onSkip={handleSkip}
                    disableWorkTimer={!canStartWorkTimer}
                    timerType={timerType}
                />
            </div>
            {notification && (
                <Notification
                    message={notification}
                    onClose={() => setNotification(null)}
                />
            )}
        </>
    );
};
