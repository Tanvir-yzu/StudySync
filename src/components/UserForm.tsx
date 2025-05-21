import React, { useState } from 'react';
import { Clock, BookOpen, Brain, User, PlusCircle, Trash2, AlertCircle, Settings } from 'lucide-react';
import { UserData, Subject, Commitment } from '../types';

interface UserFormProps {
  initialData: UserData | null;
  onSubmit: (data: UserData) => void;
}

const defaultSubject: Subject = {
  name: '',
  topics: [],
  difficulty: 3,
  proficiency: 3,
  urgency: 3,
  dueDate: '',
  examDate: ''
};

const defaultCommitment: Commitment = {
  name: '',
  days: [],
  startTime: '',
  endTime: ''
};

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<UserData>(initialData || {
    wakeUpTime: '07:00',
    bedTime: '23:00',
    peakHours: [],
    studyHoursPerDay: 4,
    subjects: [{ ...defaultSubject }],
    fixedCommitments: [],
    learningStyle: 'visual',
    preferredMethods: [],
    avoidMethods: [],
    studyLocations: [],
    availableResources: [],
    distractions: [],
    techTools: [],
    sleepHours: 8,
    exerciseRoutine: '',
    mealTimes: [],
    stressManagement: []
  });
  
  const [newTopic, setNewTopic] = useState<string>('');
  const [newPreferredMethod, setNewPreferredMethod] = useState<string>('');
  const [newAvoidMethod, setNewAvoidMethod] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newResource, setNewResource] = useState<string>('');
  const [newDistraction, setNewDistraction] = useState<string>('');
  const [newTechTool, setNewTechTool] = useState<string>('');
  const [newMealTime, setNewMealTime] = useState<string>('');
  const [newStressManagement, setNewStressManagement] = useState<string>('');
  const [activeSection, setActiveSection] = useState<number>(1);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const handleSubjectChange = (index: number, field: keyof Subject, value: any) => {
    setFormData(prev => {
      const updatedSubjects = [...prev.subjects];
      updatedSubjects[index] = {
        ...updatedSubjects[index],
        [field]: value
      };
      return {
        ...prev,
        subjects: updatedSubjects
      };
    });
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, { ...defaultSubject }]
    }));
  };

  const removeSubject = (index: number) => {
    setFormData(prev => {
      const updatedSubjects = [...prev.subjects];
      updatedSubjects.splice(index, 1);
      return {
        ...prev,
        subjects: updatedSubjects.length ? updatedSubjects : [{ ...defaultSubject }]
      };
    });
  };

  const handleCommitmentChange = (index: number, field: keyof Commitment, value: any) => {
    setFormData(prev => {
      const updatedCommitments = [...prev.fixedCommitments];
      updatedCommitments[index] = {
        ...updatedCommitments[index],
        [field]: value
      };
      return {
        ...prev,
        fixedCommitments: updatedCommitments
      };
    });
  };

  const handleCommitmentDayToggle = (index: number, day: Commitment['days'][0]) => {
    setFormData(prev => {
      const updatedCommitments = [...prev.fixedCommitments];
      const currentDays = updatedCommitments[index].days;
      
      if (currentDays.includes(day)) {
        updatedCommitments[index].days = currentDays.filter(d => d !== day);
      } else {
        updatedCommitments[index].days = [...currentDays, day];
      }
      
      return {
        ...prev,
        fixedCommitments: updatedCommitments
      };
    });
  };

  const addCommitment = () => {
    setFormData(prev => ({
      ...prev,
      fixedCommitments: [...prev.fixedCommitments, { ...defaultCommitment }]
    }));
  };

  const removeCommitment = (index: number) => {
    setFormData(prev => {
      const updatedCommitments = [...prev.fixedCommitments];
      updatedCommitments.splice(index, 1);
      return {
        ...prev,
        fixedCommitments: updatedCommitments
      };
    });
  };

  const addTopic = (subjectIndex: number) => {
    if (!newTopic.trim()) return;
    
    setFormData(prev => {
      const updatedSubjects = [...prev.subjects];
      updatedSubjects[subjectIndex].topics = [
        ...updatedSubjects[subjectIndex].topics,
        newTopic.trim()
      ];
      return {
        ...prev,
        subjects: updatedSubjects
      };
    });
    
    setNewTopic('');
  };

  const removeTopic = (subjectIndex: number, topicIndex: number) => {
    setFormData(prev => {
      const updatedSubjects = [...prev.subjects];
      updatedSubjects[subjectIndex].topics = updatedSubjects[subjectIndex].topics.filter(
        (_, idx) => idx !== topicIndex
      );
      return {
        ...prev,
        subjects: updatedSubjects
      };
    });
  };

  const addArrayItem = (array: string, value: string) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [array]: [...prev[array as keyof UserData] as string[], value.trim()]
    }));
    
    // Reset the corresponding input
    switch (array) {
      case 'preferredMethods':
        setNewPreferredMethod('');
        break;
      case 'avoidMethods':
        setNewAvoidMethod('');
        break;
      case 'studyLocations':
        setNewLocation('');
        break;
      case 'availableResources':
        setNewResource('');
        break;
      case 'distractions':
        setNewDistraction('');
        break;
      case 'techTools':
        setNewTechTool('');
        break;
      case 'mealTimes':
        setNewMealTime('');
        break;
      case 'stressManagement':
        setNewStressManagement('');
        break;
      case 'peakHours':
        // Special case for peak hours which is handled separately
        break;
    }
  };

  const removeArrayItem = (array: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [array]: (prev[array as keyof UserData] as string[]).filter((_, idx) => idx !== index)
    }));
  };

  const togglePeakHour = (hour: string) => {
    setFormData(prev => {
      const currentPeakHours = [...prev.peakHours];
      
      if (currentPeakHours.includes(hour)) {
        return {
          ...prev,
          peakHours: currentPeakHours.filter(h => h !== hour)
        };
      } else {
        return {
          ...prev,
          peakHours: [...currentPeakHours, hour]
        };
      }
    });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Basic validation
    if (!formData.wakeUpTime) newErrors.wakeUpTime = 'Wake-up time is required';
    if (!formData.bedTime) newErrors.bedTime = 'Bedtime is required';
    if (formData.studyHoursPerDay <= 0) newErrors.studyHoursPerDay = 'Study hours must be greater than 0';
    
    // Subject validation
    formData.subjects.forEach((subject, index) => {
      if (!subject.name) newErrors[`subject-${index}-name`] = 'Subject name is required';
      if (subject.topics.length === 0) newErrors[`subject-${index}-topics`] = 'At least one topic is required';
    });
    
    // Commitment validation
    formData.fixedCommitments.forEach((commitment, index) => {
      if (!commitment.name) newErrors[`commitment-${index}-name`] = 'Commitment name is required';
      if (commitment.days.length === 0) newErrors[`commitment-${index}-days`] = 'At least one day is required';
      if (!commitment.startTime) newErrors[`commitment-${index}-startTime`] = 'Start time is required';
      if (!commitment.endTime) newErrors[`commitment-${index}-endTime`] = 'End time is required';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const nextSection = () => {
    if (activeSection < 5) {
      setActiveSection(activeSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevSection = () => {
    if (activeSection > 1) {
      setActiveSection(activeSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Your Personalized Study Plan</h2>
      
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map(step => (
            <div key={step} className="flex items-center">
              <button
                onClick={() => setActiveSection(step)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeSection === step
                    ? 'bg-indigo-600 text-white'
                    : activeSection > step
                    ? 'bg-indigo-200 text-indigo-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </button>
              {step < 5 && (
                <div 
                  className={`h-1 w-16 ${
                    activeSection > step ? 'bg-indigo-200' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm font-medium text-gray-600">
          {activeSection === 1 && 'Study Availability'}
          {activeSection === 2 && 'Academic Details'}
          {activeSection === 3 && 'Learning Preferences'}
          {activeSection === 4 && 'Environmental Factors'}
          {activeSection === 5 && 'Health & Wellness'}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Section 1: Study Availability */}
        {activeSection === 1 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-lg font-semibold text-indigo-700 mb-4">
              <Clock className="h-5 w-5" />
              <h3>Study Availability</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="wakeUpTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Wake-up Time
                </label>
                <input
                  type="time"
                  id="wakeUpTime"
                  name="wakeUpTime"
                  value={formData.wakeUpTime}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.wakeUpTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.wakeUpTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.wakeUpTime}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="bedTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedtime
                </label>
                <input
                  type="time"
                  id="bedTime"
                  name="bedTime"
                  value={formData.bedTime}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.bedTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.bedTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.bedTime}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peak Energy Hours
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  return (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => togglePeakHour(`${hour}:00`)}
                      className={`py-1 px-2 text-sm rounded-md ${
                        formData.peakHours.includes(`${hour}:00`)
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {hour}:00
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Select your peak productivity hours
              </p>
            </div>
            
            <div>
              <label htmlFor="studyHoursPerDay" className="block text-sm font-medium text-gray-700 mb-1">
                Total Hours Available for Studying Per Day
              </label>
              <input
                type="number"
                id="studyHoursPerDay"
                name="studyHoursPerDay"
                min="1"
                max="24"
                value={formData.studyHoursPerDay}
                onChange={handleNumberInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.studyHoursPerDay ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.studyHoursPerDay && (
                <p className="mt-1 text-sm text-red-600">{errors.studyHoursPerDay}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fixed Commitments
                </label>
                <button
                  type="button"
                  onClick={addCommitment}
                  className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Commitment</span>
                </button>
              </div>
              
              {formData.fixedCommitments.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No fixed commitments added yet.</p>
              ) : (
                <div className="space-y-4">
                  {formData.fixedCommitments.map((commitment, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">Commitment #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeCommitment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor={`commitment-${index}-name`} className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            id={`commitment-${index}-name`}
                            value={commitment.name}
                            onChange={(e) => handleCommitmentChange(index, 'name', e.target.value)}
                            placeholder="Class, Work, Activity, etc."
                            className={`w-full p-2 border rounded-md ${
                              errors[`commitment-${index}-name`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[`commitment-${index}-name`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`commitment-${index}-name`]}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`commitment-${index}-startTime`} className="block text-sm font-medium text-gray-700 mb-1">
                              Start Time
                            </label>
                            <input
                              type="time"
                              id={`commitment-${index}-startTime`}
                              value={commitment.startTime}
                              onChange={(e) => handleCommitmentChange(index, 'startTime', e.target.value)}
                              className={`w-full p-2 border rounded-md ${
                                errors[`commitment-${index}-startTime`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors[`commitment-${index}-startTime`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`commitment-${index}-startTime`]}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor={`commitment-${index}-endTime`} className="block text-sm font-medium text-gray-700 mb-1">
                              End Time
                            </label>
                            <input
                              type="time"
                              id={`commitment-${index}-endTime`}
                              value={commitment.endTime}
                              onChange={(e) => handleCommitmentChange(index, 'endTime', e.target.value)}
                              className={`w-full p-2 border rounded-md ${
                                errors[`commitment-${index}-endTime`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors[`commitment-${index}-endTime`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`commitment-${index}-endTime`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Days
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleCommitmentDayToggle(index, day as any)}
                              className={`py-1 px-2 text-sm rounded-md ${
                                commitment.days.includes(day as any)
                                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                              }`}
                            >
                              {day.substring(0, 3)}
                            </button>
                          ))}
                        </div>
                        {errors[`commitment-${index}-days`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`commitment-${index}-days`]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={nextSection}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Next: Academic Details
              </button>
            </div>
          </div>
        )}
        
        {/* Section 2: Academic Details */}
        {activeSection === 2 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-lg font-semibold text-indigo-700 mb-4">
              <BookOpen className="h-5 w-5" />
              <h3>Academic Details</h3>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Subjects/Courses
                </label>
                <button
                  type="button"
                  onClick={addSubject}
                  className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Subject</span>
                </button>
              </div>
              
              <div className="space-y-6">
                {formData.subjects.map((subject, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Subject #{index + 1}</h4>
                      {formData.subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubject(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor={`subject-${index}-name`} className="block text-sm font-medium text-gray-700 mb-1">
                          Subject Name
                        </label>
                        <input
                          type="text"
                          id={`subject-${index}-name`}
                          value={subject.name}
                          onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                          placeholder="e.g., Mathematics, History, etc."
                          className={`w-full p-2 border rounded-md ${
                            errors[`subject-${index}-name`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`subject-${index}-name`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`subject-${index}-name`]}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`subject-${index}-dueDate`} className="block text-sm font-medium text-gray-700 mb-1">
                            Assignment Due Date
                          </label>
                          <input
                            type="date"
                            id={`subject-${index}-dueDate`}
                            value={subject.dueDate || ''}
                            onChange={(e) => handleSubjectChange(index, 'dueDate', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor={`subject-${index}-examDate`} className="block text-sm font-medium text-gray-700 mb-1">
                            Exam Date
                          </label>
                          <input
                            type="date"
                            id={`subject-${index}-examDate`}
                            value={subject.examDate || ''}
                            onChange={(e) => handleSubjectChange(index, 'examDate', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Topics
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {subject.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                            <span className="text-sm">{topic}</span>
                            <button
                              type="button"
                              onClick={() => removeTopic(index, topicIndex)}
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          placeholder="Add a topic"
                          className="flex-1 p-2 border border-gray-300 rounded-l-md"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTopic(index);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => addTopic(index)}
                          className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                        >
                          Add
                        </button>
                      </div>
                      {errors[`subject-${index}-topics`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`subject-${index}-topics`]}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Difficulty (1-5)
                        </label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleSubjectChange(index, 'difficulty', value)}
                              className={`flex-1 py-1 ${
                                subject.difficulty === value
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-100 text-gray-700'
                              } ${value === 1 ? 'rounded-l-md' : ''} ${
                                value === 5 ? 'rounded-r-md' : ''
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          1 = Very Easy, 5 = Very Difficult
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Proficiency (1-5)
                        </label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleSubjectChange(index, 'proficiency', value)}
                              className={`flex-1 py-1 ${
                                subject.proficiency === value
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-100 text-gray-700'
                              } ${value === 1 ? 'rounded-l-md' : ''} ${
                                value === 
                                5 ? 'rounded-r-md' : ''
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          1 = Beginner, 5 = Expert
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Urgency (1-5)
                        </label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleSubjectChange(index, 'urgency', value)}
                              className={`flex-1 py-1 ${
                                subject.urgency === value
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-100 text-gray-700'
                              } ${value === 1 ? 'rounded-l-md' : ''} ${
                                value === 5 ? 'rounded-r-md' : ''
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          1 = Low Priority, 5 = Urgent
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between space-x-4 pt-4">
              <button
                type="button"
                onClick={prevSection}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextSection}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Next: Learning Preferences
              </button>
            </div>
          </div>
        )}
        
        {/* Section 3: Learning Preferences */}
        {activeSection === 3 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-lg font-semibold text-indigo-700 mb-4">
              <Brain className="h-5 w-5" />
              <h3>Learning Preferences</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Learning Style
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { value: 'visual', label: 'Visual', description: 'Diagrams, charts, videos' },
                  { value: 'auditory', label: 'Auditory', description: 'Lectures, discussions, recordings' },
                  { value: 'reading/writing', label: 'Reading/Writing', description: 'Texts, notes, summaries' },
                  { value: 'kinesthetic', label: 'Kinesthetic', description: 'Hands-on practice, movement' }
                ].map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, learningStyle: style.value as any }))}
                    className={`p-3 border rounded-md text-left ${
                      formData.learningStyle === style.value
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">{style.label}</div>
                    <div className="text-sm text-gray-600">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Study Methods That Work Well For You
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.preferredMethods.map((method, index) => (
                    <div key={index} className="bg-green-100 px-3 py-1 rounded-full flex items-center">
                      <span className="text-sm text-green-800">{method}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('preferredMethods', index)}
                        className="ml-2 text-green-500 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newPreferredMethod}
                    onChange={(e) => setNewPreferredMethod(e.target.value)}
                    placeholder="e.g., Flashcards, Group study"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('preferredMethods', newPreferredMethod);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('preferredMethods', newPreferredMethod)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Study Techniques You Want to Avoid
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.avoidMethods.map((method, index) => (
                    <div key={index} className="bg-red-100 px-3 py-1 rounded-full flex items-center">
                      <span className="text-sm text-red-800">{method}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('avoidMethods', index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newAvoidMethod}
                    onChange={(e) => setNewAvoidMethod(e.target.value)}
                    placeholder="e.g., Cramming, All-nighters"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('avoidMethods', newAvoidMethod);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('avoidMethods', newAvoidMethod)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between space-x-4 pt-4">
              <button
                type="button"
                onClick={prevSection}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextSection}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Next: Environmental Factors
              </button>
            </div>
          </div>
        )}
        
        {/* Section 4: Environmental Factors */}
        {activeSection === 4 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-lg font-semibold text-indigo-700 mb-4">
              <Settings className="h-5 w-5" />
              <h3>Environmental Factors</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Study Location(s)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.studyLocations.map((location, index) => (
                    <div key={index} className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                      <span className="text-sm text-blue-800">{location}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('studyLocations', index)}
                        className="ml-2 text-blue-500 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g., Library, Home desk"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('studyLocations', newLocation);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('studyLocations', newLocation)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Study Materials and Resources
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.availableResources.map((resource, index) => (
                    <div key={index} className="bg-purple-100 px-3 py-1 rounded-full flex items-center">
                      <span className="text-sm text-purple-800">{resource}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('availableResources', index)}
                        className="ml-2 text-purple-500 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    placeholder="e.g., Textbooks, Online courses"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('availableResources', newResource);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('availableResources', newResource)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Potential Distractions to Manage
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.distractions.map((distraction, index) => (
                    <div key={index} className="bg-yellow-100 px-3 py-1 rounded-full flex items-center">
                      <span className="text-sm text-yellow-800">{distraction}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('distractions', index)}
                        className="ml-2 text-yellow-600 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newDistraction}
                    onChange={(e) => setNewDistraction(e.target.value)}
                    placeholder="e.g., Social media, Noise"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('distractions', newDistraction);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('distractions', newDistraction)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technology Tools You Can Access
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.techTools.map((tool, index) => (
                    <div key={index} className="bg-indigo-100 px-3 py-1 rounded-full flex items-center">
                      <span className="text-sm text-indigo-800">{tool}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('techTools', index)}
                        className="ml-2 text-indigo-500 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newTechTool}
                    onChange={(e) => setNewTechTool(e.target.value)}
                    placeholder="e.g., Laptop, Study apps"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('techTools', newTechTool);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('techTools', newTechTool)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between space-x-4 pt-4">
              <button
                type="button"
                onClick={prevSection}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextSection}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Next: Health & Wellness
              </button>
            </div>
          </div>
        )}
        
        {/* Section 5: Health & Wellness */}
        {activeSection === 5 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-lg font-semibold text-indigo-700 mb-4">
              <User className="h-5 w-5" />
              <h3>Health & Wellness</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sleepHours" className="block text-sm font-medium text-gray-700 mb-1">
                  Desired Sleep Hours
                </label>
                <input
                  type="number"
                  id="sleepHours"
                  name="sleepHours"
                  min="4"
                  max="12"
                  value={formData.sleepHours}
                  onChange={handleNumberInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="exerciseRoutine" className="block text-sm font-medium text-gray-700 mb-1">
                  Exercise Routine
                </label>
                <input
                  type="text"
                  id="exerciseRoutine"
                  name="exerciseRoutine"
                  value={formData.exerciseRoutine}
                  onChange={handleInputChange}
                  placeholder="e.g., 30 min walk daily, gym 3x/week"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Times
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.mealTimes.map((mealTime, index) => (
                    <div key={index} className="bg-orange-100 px-3 py-1 rounded-full flex items-center">
                      <span className="text-sm text-orange-800">{mealTime}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('mealTimes', index)}
                        className="ml-2 text-orange-500 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newMealTime}
                    onChange={(e) => setNewMealTime(e.target.value)}
                    placeholder="e.g., Breakfast 8am, Lunch 1pm"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('mealTimes', newMealTime);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('mealTimes', newMealTime)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stress Management Techniques
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.stressManagement.map((technique, index) => (
                    <div key={index} className="bg-teal-100 px-3 py-1 rounded-full flex items-center">
                      <span className="text-sm text-teal-800">{technique}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('stressManagement', index)}
                        className="ml-2 text-teal-500 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newStressManagement}
                    onChange={(e) => setNewStressManagement(e.target.value)}
                    placeholder="e.g., Meditation, Deep breathing"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('stressManagement', newStressManagement);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('stressManagement', newStressManagement)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between space-x-4 pt-6">
              <button
                type="button"
                onClick={prevSection}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center space-x-2"
              >
                <span>Generate Study Plan</span>
                <PlusCircle className="h-4 w-4" />
              </button>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">Important Note</p>
                <p>Your data will be saved in your browser's local storage. No data is sent to any server. You can reset all data using the "Reset" button in the top navigation.</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserForm;