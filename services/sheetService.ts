import { WorkoutLog } from '../types';

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

export const logWorkoutToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  logData: WorkoutLog,
  dayType: string
): Promise<boolean> => {
  const date = new Date().toLocaleDateString('zh-CN');
  
  // Prepare row data: [Date, Day Type, Exercise, Weight, Reps, Notes]
  const values = [
    [
      date,
      dayType,
      logData.exerciseName,
      logData.weight,
      logData.reps,
      logData.notes || ''
    ]
  ];

  const body = {
    values: values
  };

  try {
    // We use "Sheet1" as default. ValueInputOption USER_ENTERED parses numbers correctly.
    const range = 'Sheet1!A1'; 
    const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Sheet API Error:', err);
      throw new Error('Failed to log to sheet');
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
