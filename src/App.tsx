import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, Brain, User, Settings, Save, PlusCircle, Trash2, Edit, CheckCircle, AlertCircle } from 'lucide-react';
import UserForm from './components/UserForm';
import Schedule from './components/Schedule';
import Dashboard from './components/Dashboard';
import { UserData, ScheduleData } from './types';

function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'schedule' | 'dashboard'>('form');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedUserData = localStorage.getItem('studyScheduleUserData');
    const savedScheduleData = localStorage.getItem('studyScheduleData');
    
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      if (savedScheduleData) {
        setScheduleData(JSON.parse(savedScheduleData));
        setActiveTab('dashboard');
      } else {
        setActiveTab('form');
      }
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem('studyScheduleUserData', JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (scheduleData) {
      localStorage.setItem('studyScheduleData', JSON.stringify(scheduleData));
    }
  }, [scheduleData]);

  const generateSchedule = (data: UserData) => {
    setIsLoading(true);
    setTimeout(() => {
      const newSchedule = createSchedule(data);
      setScheduleData(newSchedule);
      setActiveTab('schedule');
      setIsLoading(false);
    }, 1500);
  };

  const createSchedule = (data: UserData): ScheduleData => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule: ScheduleData = {
      weeklySchedule: {},
      dailyTasks: {},
      studyTechniques: [],
      breakPatterns: [],
      reviewSlots: [],
      progressTracking: {
        subjects: data.subjects.map(subject => ({
          name: subject.name,
          progress: 0,
          lastStudied: null
        }))
      },
      contingencyPlans: [
        "If you miss a study session, prioritize the most urgent topics in your next available slot",
        "If you're feeling overwhelmed, focus on review rather than new material",
        "If you're struggling with a topic, switch to a different learning method"
      ]
    };

    const wakeTime = parseInt(data.wakeUpTime.split(':')[0]);
    const sleepTime = parseInt(data.bedTime.split(':')[0]);
    const availableHours = sleepTime > wakeTime ? sleepTime - wakeTime : (24 - wakeTime) + sleepTime;
    const totalDifficulty = data.subjects.reduce((sum, subject) => sum + subject.difficulty, 0);
    const totalHoursPerWeek = data.studyHoursPerDay * 7;
    
    days.forEach(day => {
      schedule.weeklySchedule[day] = [];
      schedule.dailyTasks[day] = [];
      
      const dayCommitments = data.fixedCommitments.filter(commitment => 
        commitment.days.includes(day as any)
      );
      
      let currentHour = wakeTime;
      while (currentHour !== sleepTime) {
        const timeBlock = {
          startTime: `${currentHour}:00`,
          endTime: `${(currentHour + 1) % 24}:00`,
          activity: 'Free',
          subject: null
        };
        
        const hasCommitment = dayCommitments.some(commitment => {
          const commitmentStart = parseInt(commitment.startTime.split(':')[0]);
          const commitmentEnd = parseInt(commitment.endTime.split(':')[0]);
          return (currentHour >= commitmentStart && currentHour < commitmentEnd);
        });
        
        if (hasCommitment) {
          const commitment = dayCommitments.find(commitment => {
            const commitmentStart = parseInt(commitment.startTime.split(':')[0]);
            const commitmentEnd = parseInt(commitment.endTime.split(':')[0]);
            return (currentHour >= commitmentStart && currentHour < commitmentEnd);
          });
          
          if (commitment) {
            timeBlock.activity = 'Commitment';
            timeBlock.subject = commitment.name;
          }
        }
        
        schedule.weeklySchedule[day].push(timeBlock);
        currentHour = (currentHour + 1) % 24;
        if (currentHour === 0) currentHour = 24;
      }
      
      const availableBlocks = schedule.weeklySchedule[day].filter(block => block.activity === 'Free');
      let blockIndex = 0;
      
      const sortedSubjects = [...data.subjects].sort((a, b) => {
        const priorityA = (a.difficulty * a.urgency) / a.proficiency;
        const priorityB = (b.difficulty * b.urgency) / b.proficiency;
        return priorityB - priorityA;
      });
      
      sortedSubjects.forEach(subject => {
        const subjectHoursPerWeek = (subject.difficulty / totalDifficulty) * totalHoursPerWeek;
        const subjectHoursPerDay = Math.round(subjectHoursPerWeek / 7);
        
        for (let i = 0; i < subjectHoursPerDay && blockIndex < availableBlocks.length; i++) {
          const blockToAssign = availableBlocks[blockIndex];
          const blockIndexInDay = schedule.weeklySchedule[day].findIndex(
            block => block.startTime === blockToAssign.startTime
          );
          
          if (blockIndexInDay !== -1) {
            schedule.weeklySchedule[day][blockIndexInDay].activity = 'Study';
            schedule.weeklySchedule[day][blockIndexInDay].subject = subject.name;
            
            schedule.dailyTasks[day].push({
              subject: subject.name,
              task: `Study ${subject.topics[Math.floor(Math.random() * subject.topics.length)]}`,
              duration: '1 hour',
              completed: false
            });
          }
          
          blockIndex++;
        }
      });
      
      if (blockIndex < availableBlocks.length) {
        const blockToAssign = availableBlocks[blockIndex];
        const blockIndexInDay = schedule.weeklySchedule[day].findIndex(
          block => block.startTime === blockToAssign.startTime
        );
        
        if (blockIndexInDay !== -1) {
          schedule.weeklySchedule[day][blockIndexInDay].activity = 'Review';
          schedule.weeklySchedule[day][blockIndexInDay].subject = 'All Subjects';
          
          schedule.reviewSlots.push({
            day,
            time: blockToAssign.startTime,
            subjects: data.subjects.map(s => s.name)
          });
          
          blockIndex++;
        }
      }
    });
    
    const techniques = [];
    switch (data.learningStyle) {
      case 'visual':
        techniques.push(
          'Create mind maps for complex topics',
          'Use color-coded notes for different concepts',
          'Watch video tutorials for difficult subjects',
          'Draw diagrams to visualize processes'
        );
        break;
      case 'auditory':
        techniques.push(
          'Record yourself explaining concepts and listen back',
          'Participate in study groups with discussions',
          'Use text-to-speech for reading materials',
          'Explain concepts out loud to yourself'
        );
        break;
      case 'reading/writing':
        techniques.push(
          'Create detailed written summaries',
          'Rewrite notes in your own words',
          'Use the Cornell note-taking system',
          'Create flashcards for key concepts'
        );
        break;
      case 'kinesthetic':
        techniques.push(
          'Use physical movement while reviewing material',
          'Create physical models or representations',
          'Take short walks between study sessions',
          'Use hands-on experiments when possible'
        );
        break;
    }
    
    data.preferredMethods.forEach(method => {
      if (!techniques.includes(method)) {
        techniques.push(method);
      }
    });
    
    schedule.studyTechniques = techniques;
    
    schedule.breakPatterns = [
      { duration: '25 minutes study, 5 minutes break', repeat: 4, longBreak: '15-30 minutes' },
      { duration: '50 minutes study, 10 minutes break', repeat: 2, longBreak: '30 minutes' },
      { duration: '90 minutes study, 20 minutes break', repeat: 2, longBreak: '60 minutes' }
    ];
    
    return schedule;
  };

  const saveSchedule = () => {
    if (scheduleData) {
      setActiveTab('dashboard');
    }
  };

  const resetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('studyScheduleUserData');
      localStorage.removeItem('studyScheduleData');
      setUserData(null);
      setScheduleData(null);
      setActiveTab('form');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-800">StudySync</h1>
              </div>
              {userData && (
                <button
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Settings className="h-6 w-6 text-gray-600" />
                </button>
              )}
            </div>
            
            {userData && (
              <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
                  <button 
                    onClick={() => {
                      setActiveTab('form');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${
                      activeTab === 'form' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setActiveTab('schedule');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${
                      activeTab === 'schedule' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    disabled={!scheduleData}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Schedule</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${
                      activeTab === 'dashboard' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    disabled={!scheduleData}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Dashboard</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      resetData();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-600">Generating your personalized study plan...</p>
          </div>
        ) : (
          <>
            {activeTab === 'form' && (
              <UserForm 
                initialData={userData} 
                onSubmit={(data) => {
                  setUserData(data);
                  generateSchedule(data);
                }} 
              />
            )}
            
            {activeTab === 'schedule' && scheduleData && (
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Your Personalized Study Schedule</h2>
                  <button 
                    onClick={saveSchedule}
                    className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition w-full md:w-auto"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save & Continue</span>
                  </button>
                </div>
                
                <Schedule data={scheduleData} userData={userData!} />
              </div>
            )}
            
            {activeTab === 'dashboard' && scheduleData && (
              <Dashboard scheduleData={scheduleData} userData={userData!} />
            )}
          </>
        )}
      </main>
      
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-semibold">StudySync</span>
            </div>
            
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} StudySync. All data is stored locally in your browser.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;