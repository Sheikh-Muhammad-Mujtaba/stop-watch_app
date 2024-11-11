"use client";

import { useState, useEffect, useRef } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, Flag, Share2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion"


// Define the LapTime type
type LapTime = {
    id: number
    time: number
    difference: number
}

export default function StopWatch() {
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
    const [bestLap, setBestLap] = useState<number | null>(null)
    const [worstLap, setWorstLap] = useState<number | null>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const lastLapTimeRef = useRef(0)



    // useEffect to handle the stopwatch timer
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isRunning]);

    // Function to handle starting and stoping the stopwatch
    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };



    // Function to handle resetting the stopwatch
    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
        setLapTimes([]);
        setBestLap(null)
        setWorstLap(null)
        lastLapTimeRef.current = 0
    };

    // Function to handle recording a lap time
    const handleLap = () => {
        const lapTime = time - lastLapTimeRef.current
        const newLap: LapTime = {
            id: lapTimes.length + 1,
            time: time,
            difference: lapTime,
        }
        setLapTimes((prevLapTimes) => [newLap, ...prevLapTimes])
        lastLapTimeRef.current = time

        if (bestLap === null || lapTime < bestLap) {
            setBestLap(lapTime)
        }
        if (worstLap === null || lapTime > worstLap) {
            setWorstLap(lapTime)
        }
    };

    // Calculate minutes, seconds, and milliseconds from the elapsed time
    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString().padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`
    }

    const handleShare = async () => {
        const shareText = `My Stopwatch Results:
Total Time: ${formatTime(time)}
Number of Laps: ${lapTimes.length}
Best Lap: ${bestLap ? formatTime(bestLap) : "N/A"}
Worst Lap: ${worstLap ? formatTime(worstLap) : "N/A"}
Try it: https://stop-watch_app.vercel.com`

        try {
            await navigator.share({ text: shareText })
        } catch (error) {
            console.error("Error sharing results:", error)
        }
    }

    // JSX return statement rendering the Stopwatch UI
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-950 dark:to-pink-700 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="flex flex-col items-center justify-center">
                    <CardTitle className="text-5xl font-bold">Stopwatch</CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-300 text-center">
                        Track your time with this stopwatch.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-8 p-4">
                    {/* Display the elapsed time */}
                    <div
                        key={time}
                        className="text-5xl sm:text-6xl font-bold text-gray-800 dark:text-gray-400 tabular-nums"
                    >
                        {formatTime(time)}
                    </div>
                    {/* Buttons to control the stopwatch */}
                    <div className="flex gap-3 sm:gap-4">
                        <Button
                            onClick={handleStartStop}
                            className={`px-4 sm:px-6 py-3 rounded-full text-white transition-colors ${isRunning
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                                }`}
                        >
                            {isRunning ? <Pause size={24} /> : <Play size={24} />}
                        </Button>
                        <Button
                            onClick={handleReset}
                            className="px-4 sm:px-6 py-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                        >
                            <RotateCcw size={24} />
                        </Button>
                        <Button
                            onClick={handleLap}
                            disabled={!isRunning}
                            className="px-4 sm:px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
                        >
                            <Flag size={24} />
                        </Button>
                        <Button
                            onClick={handleShare}
                            className="px-4 sm:px-6 py-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                        >
                            <Share2 size={24} />
                        </Button>
                    </div>
                    {/* Display the list of lap times */}


                    <div className="w-full">
                        <h3 className="text-lg font-semibold mb-2">Lap Times</h3>
                        <div className="flex flex-row justify-between p-2 rounded-t-md border">
                      <div className="flex">Lap</div>
                      <div className="flex">Time</div>
                    </div>
                        <ScrollArea className="h-[150px] w-full rounded-md rounded-t-none border p-4">
                            <AnimatePresence initial={false}>
                                {lapTimes.map((lap) => (
                                    <motion.div
                                        key={lap.id}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className={`flex justify-between items-center py-2 border-b ${lap.difference === bestLap
                                                ? "text-green-600 font-bold"
                                                : lap.difference === worstLap
                                                    ? "text-red-600 font-bold"
                                                    : ""
                                            }`}
                                    >
                                        <span>Lap {lap.id}</span>
                                        <span>{formatTime(lap.difference)}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </ScrollArea>
                    </div>

                    <div className="w-full flex justify-between text-sm text-gray-600 dark:text-gray-50">
                        <div>Best Lap: {bestLap ? formatTime(bestLap) : "N/A"}</div>
                        <div>Worst Lap: {worstLap ? formatTime(worstLap) : "N/A"}</div>
                    </div>
                </CardContent>
            </Card>
        </div>

    );
}