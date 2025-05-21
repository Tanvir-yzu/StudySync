import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, CheckCircle, BarChart, AlertCircle, Edit } from 'lucide-react';
import { ScheduleData, UserData, Task } from '../types';

interface DashboardProps {
  scheduleData: ScheduleData;
  userData: UserData;
}

const Dashboard: React.FC<DashboardProps> = ({ scheduleData, userData }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [activeDay, setActiveDay] = useState<string>(getCurrentDay());
  const [tasks, setTasks] = useState<{[key: string]: Task[]}>({...scheduleData.dailyTasks});
  
  function getCurrentDay(): string {
    const dayIndex = new Date().getDay();
    // Convert from Sunday-based (0) to Monday-based (0)
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return days[adjustedIndex];
  }
  
  const toggleTaskCompletion = (dayKey: string, taskIndex: number) => {
    setTasks(prev => {
      const updatedTasks = {...prev};
      if (updatedTasks[dayKey]) {
        updatedTasks[dayKey] = [...updatedTasks[dayKey]];
        updatedTasks[dayKey][taskIndex] = {
          ...updatedTasks[dayKey][taskIndex],
          completed: !updatedTasks[dayKey][taskIndex].completed
        };
      }
      return updatedTasks;
    });
    
    // Update progress tracking
    const task = tasks[dayKey][taskIndex];
    const subjectName = task.subject;
    
    if (scheduleData.progressTracking.subjects) {
      const subjectIndex = scheduleData.progressTracking.subjects.findIndex(
        s => s.name === subjectName
      );
      
      if (subjectIndex !== -1) {
        const updatedSubjects = [...scheduleData.progressTracking.subjects];
        const subject = updatedSubjects[subjectIndex];
        
        // Simple progress calculation - could be more sophisticated
        const newProgress = task.completed ? Math.max(0, subject.progress - 10) : Math.min(100, subject.progress + 10);
        
        updatedSubjects[subjectIndex] = {
          ...subject,
          progress: newProgress,
          lastStudied: task.completed ? subject.lastStudied : new Date().toISOString()
        };
        
        scheduleData.progressTracking.subjects = updatedSubjects;
      }
    }
  };
  
  const calculateOverallProgress = (): number => {
    if (!scheduleData.progressTracking.subjects || scheduleData.progressTracking.subjects.length === 0) {
      return 0;
    }
    
    const totalProgress = scheduleData.progressTracking.subjects.reduce(
      (sum, subject) => sum + subject.progress, 
      0
    );
    
    return Math.round(totalProgress / scheduleData.progressTracking.subjects.length);
  };
  
  const getCompletedTasksCount = (): number => {
    let count = 0;
    Object.values(tasks).forEach(dayTasks => {
      dayTasks.forEach(task => {
        if (task.completed) count++;
      });
    });
    return count;
  };
  
  const getTotalTasksCount = (): number => {
    let count = 0;
    Object.values(tasks).forEach(dayTasks => {
      count += dayTasks.length;
    });
    return count;
  };
  
  const getUpcomingDeadlines = () => {
    const deadlines = [];
    
    for (const subject of userData.subjects) {
      if (subject.dueDate) {
        deadlines.push({
          type: 'Assignment',
          subject: subject.name,
          date: subject.dueDate
        });
      }
      
      if (subject.examDate) {
        deadlines.push({
          type: 'Exam',
          subject: subject.name,
          date: subject.examDate
        });
      }
    }
    
    // Sort by date (closest first)
    return deadlines.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getDaysUntil = (dateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-indigo-600"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - calculateOverallProgress() / 100)}`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{calculateOverallProgress()}%</span>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                {getCompletedTasksCount()} of {getTotalTasksCount()} tasks completed
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
          </div>
          
          <div className="space-y-3">
            {scheduleData.weeklySchedule[activeDay]?.filter(block => block.activity !== 'Free').slice(0, 3).map((block, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="bg-indigo-100 text-indigo-800 p-2 rounded-md">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{block.startTime} - {block.endTime}</p>
                  <p className="text-sm text-gray-600">{block.activity}: {block.subject}</p>
                </div>
              </div>
            ))}
            
            {(!scheduleData.weeklySchedule[activeDay] || 
              scheduleData.weeklySchedule[activeDay].filter(block => block.activity !== 'Free').length === 0) && (
              <p className="text-gray-500 text-center py-4">No activities scheduled for today.</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h3>
          </div>
          
          <div className="space-y-3">
            {getUpcomingDeadlines().slice(0, 3).map((deadline, index) => {
              const daysUntil = getDaysUntil(deadline.date);
              let urgencyClass = 'text-green-600';
              
              if (daysUntil <= 3) {
                urgencyClass = 'text-red-600';
              } else if (daysUntil <= 7) {
                urgencyClass = 'text-orange-600';
              } else if (daysUntil <= 14) {
                urgencyClass = 'text-yellow-600';
              }
              
              return (
                <div key={index} className="border-l-4 border-indigo-500 pl-3 py-1">
                  <p className="font-medium">{deadline.subject} {deadline.type}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">{formatDate(deadline.date)}</p>
                    <p className={`text-sm font-medium ${urgencyClass}`}>
                      {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {getUpcomingDeadlines().length === 0 && (
              <p className="text-gray-500 text-center py-4">No upcoming deadlines.</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-800">Today's Tasks</h3>
            </div>
            
            <div className="flex space-x-1">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    activeDay === day
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day.charAt(0)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            {tasks[activeDay]?.map((task, index) => (
              <div 
                key={index}
                className={`border rounded-md p-3 flex items-center justify-between ${
                  task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleTaskCompletion(activeDay, index)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      task.completed
                        ? 'bg-green-100 text-green-600'
                        : 'border border-gray-300 text-white hover:bg-gray-100'
                    }`}
                  >
                    {task.completed && <CheckCircle className="h-4 w-4" />}
                  </button>
                  
                  <div>
                    <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                      {task.task}
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs">
                        {task.subject}
                      </span>
                      <span className="text-gray-500">{task.duration}</span>
                    </div>
                  </div>
                </div>
                
                <button className="text-gray-400 hover:text-indigo-600">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {(!tasks[activeDay] || tasks[activeDay].length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No tasks scheduled for {activeDay}.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Subject Progress</h3>
          </div>
          
          <div className="space-y-4">
            {scheduleData.progressTracking.subjects.map((subject, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium text-gray-700">{subject.name}</p>
                  <p className="text-sm text-gray-600">{subject.progress}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
                {subject.lastStudied && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last studied: {new Date(subject.lastStudied).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Recommended Study Techniques</h3>
          </div>
          
          <div className="space-y-2">
            {scheduleData.studyTechniques.map((technique, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-md p-3"
              >
                <p>{technique}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Break Patterns</h3>
          </div>
          
          <div className="space-y-2">
            {scheduleData.breakPatterns.map((pattern, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-md p-3"
              >
                <p className="font-medium">{pattern.duration}</p>
                <p className="text-sm text-gray-600">
                  Repeat {pattern.repeat} times, then take a {pattern.longBreak} break
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;