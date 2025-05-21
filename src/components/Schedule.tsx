import React, { useState } from 'react';
import { Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { ScheduleData, UserData, TimeBlock } from '../types';

interface ScheduleProps {
  data: ScheduleData;
  userData: UserData;
}

const Schedule: React.FC<ScheduleProps> = ({ data, userData }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [activeDay, setActiveDay] = useState<string>(days[0]);
  
  const getActivityColor = (activity: TimeBlock['activity']) => {
    switch (activity) {
      case 'Study':
        return 'bg-indigo-100 border-indigo-300 text-indigo-800';
      case 'Break':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'Commitment':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'Review':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };
  
  const nextDay = () => {
    const currentIndex = days.indexOf(activeDay);
    if (currentIndex < days.length - 1) {
      setActiveDay(days[currentIndex + 1]);
    }
  };
  
  const prevDay = () => {
    const currentIndex = days.indexOf(activeDay);
    if (currentIndex > 0) {
      setActiveDay(days[currentIndex - 1]);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h3 className="text-xl font-semibold text-gray-800">Weekly Schedule</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={prevDay}
            disabled={activeDay === days[0]}
            className={`p-1 rounded-full ${
              activeDay === days[0]
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <span className="font-medium text-gray-800 w-24 text-center">{activeDay}</span>
          
          <button
            onClick={nextDay}
            disabled={activeDay === days[days.length - 1]}
            className={`p-1 rounded-full ${
              activeDay === days[days.length - 1]
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`py-2 px-4 rounded-md text-center ${
                  activeDay === day
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Daily Schedule for {activeDay}</h4>
            
            <div className="space-y-2">
              {data.weeklySchedule[activeDay]?.map((block, index) => (
                <div 
                  key={index}
                  className={`border rounded-md p-3 flex items-center justify-between ${
                    getActivityColor(block.activity)
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">
                      {block.startTime} - {block.endTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {block.activity}
                    </span>
                    {block.subject && (
                      <span className="text-sm bg-white bg-opacity-50 px-2 py-0.5 rounded-full">
                        {block.subject}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {(!data.weeklySchedule[activeDay] || data.weeklySchedule[activeDay].length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  No schedule available for this day.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">Tasks for {activeDay}</h4>
          
          <div className="space-y-2">
            {data.dailyTasks[activeDay]?.map((task, index) => (
              <div 
                key={index}
                className="border border-gray-200 bg-white rounded-md p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{task.task}</div>
                  <div className="text-sm text-gray-600">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs">
                      {task.subject}
                    </span>
                    <span className="ml-2">{task.duration}</span>
                  </div>
                </div>
                
                <div>
                  <button className="text-gray-400 hover:text-green-500">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            
            {(!data.dailyTasks[activeDay] || data.dailyTasks[activeDay].length === 0) && (
              <div className="text-center py-4 text-gray-500">
                No tasks scheduled for this day.
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">Recommended Study Techniques</h4>
          
          <div className="space-y-2">
            {data.studyTechniques.map((technique, index) => (
              <div 
                key={index}
                className="border border-gray-200 bg-white rounded-md p-3"
              >
                <div className="font-medium">{technique}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">Break Patterns (Pomodoro Technique)</h4>
          
          <div className="space-y-2">
            {data.breakPatterns.map((pattern, index) => (
              <div 
                key={index}
                className="border border-gray-200 bg-white rounded-md p-3"
              >
                <div className="font-medium">{pattern.duration}</div>
                <div className="text-sm text-gray-600">
                  Repeat {pattern.repeat} times, then take a {pattern.longBreak} break
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">Review Slots</h4>
          
          <div className="space-y-2">
            {data.reviewSlots.map((slot, index) => (
              <div 
                key={index}
                className="border border-gray-200 bg-white rounded-md p-3"
              >
                <div className="font-medium">{slot.day} at {slot.time}</div>
                <div className="text-sm text-gray-600">
                  Subjects: {slot.subjects.join(', ')}
                </div>
              </div>
            ))}
            
            {data.reviewSlots.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No review slots scheduled.
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-700 mb-3">Contingency Plans</h4>
        
        <div className="space-y-2">
          {data.contingencyPlans.map((plan, index) => (
            <div 
              key={index}
              className="border border-gray-200 bg-white rounded-md p-3"
            >
              <div className="font-medium">Plan #{index + 1}</div>
              <div className="text-gray-700">{plan}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;