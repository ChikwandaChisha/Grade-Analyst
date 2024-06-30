'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const GradeAnalyst = () => {
  const [grades, setGrades] = useState([]);
  const [metrics, setMetrics] = useState({ mean: 0, median: 0, mode: 0, iqr: 0, stdDev: 0 });
  const [newGrade, setNewGrade] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'grades'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const gradesArray = [];
      querySnapshot.forEach((doc) => {
        gradesArray.push({ ...doc.data(), id: doc.id });
      });
      setGrades(gradesArray);
      calculateMetrics(gradesArray);
    });

    return () => unsubscribe();
  }, []);

  const calculateMetrics = (grades) => {
    if (grades.length === 0) return;

    const sortedGrades = [...grades].sort((a, b) => a - b);
    const mean = sortedGrades.reduce((a, b) => a + b, 0) / grades.length;
    const median = sortedGrades[Math.floor(grades.length / 2)];
    const mode = sortedGrades.sort((a, b) =>
      sortedGrades.filter(v => v === a).length - sortedGrades.filter(v => v === b).length
    ).pop();
    const q1 = sortedGrades[Math.floor((grades.length / 4))];
    const q3 = sortedGrades[Math.floor((grades.length * (3 / 4)))];
    const iqr = q3 - q1;

    const variance = sortedGrades.reduce((sum, grade) => sum + Math.pow(grade - mean, 2), 0) / grades.length;
    const stdDev = Math.sqrt(variance);

    setMetrics({ mean, median, mode, iqr, stdDev });
  };

  const addGrade = async (e) => {
    e.preventDefault();
    if (newGrade) {
      await addDoc(collection(db, 'grades'), { grade: parseFloat(newGrade) });
      setNewGrade('');
    }
  };

  const deleteGrade = async (id) => {
    await deleteDoc(doc(db, 'grades', id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Grade Analyst</h1>
      <div className="mb-4">
        <h2 className="text-2xl">Metrics</h2>
        <p>Mean: {metrics.mean}</p>
        <p>Median: {metrics.median}</p>
        <p>Mode: {metrics.mode}</p>
        <p>Interquartile Range: {metrics.iqr}</p>
        <p>Standard Deviation: {metrics.stdDev}</p>
      </div>
      <form onSubmit={addGrade} className="mb-4">
        <input
          value={newGrade}
          onChange={(e) => setNewGrade(e.target.value)}
          className="p-2 border"
          type="number"
          placeholder="Enter grade"
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-blue-500 text-white"
        >
          Add Grade
        </button>
      </form>
      <div className="grades-list">
        <h2 className="text-2xl mb-2">Grades</h2>
        {grades.map((grade, index) => (
          <div key={index} className="grade-item p-2 bg-gray-200 mb-1 rounded flex justify-between items-center">
            <span>{grade.grade}</span>
            <button
              onClick={() => deleteGrade(grade.id)}
              className="ml-2 p-2 bg-red-500 text-white"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradeAnalyst;
