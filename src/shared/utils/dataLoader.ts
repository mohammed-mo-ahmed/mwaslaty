import Papa from 'papaparse';

export async function loadCSVData<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as T[]);
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
}
