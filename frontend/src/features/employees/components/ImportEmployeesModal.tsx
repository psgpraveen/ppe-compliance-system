import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useBulkImportEmployees } from '../hooks/useEmployees';

interface ImportEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportEmployeesModal: React.FC<ImportEmployeesModalProps> = ({ isOpen, onClose }) => {
  const bulkImportMutation = useBulkImportEmployees();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        "Name": "Praveen Sharma",
        "Worker ID": "WRK0001",
        "Job Profile": "Forklift Operator",
        "Department": "Warehouse & Logistics",
        "Mobile Number": "7218196001",
        "Aadhar Number": "338908386379"
      }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Workers");
    XLSX.writeFile(wb, "workers_template.xlsx");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseExcel(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      parseExcel(droppedFile);
    }
  };

  const parseExcel = (file: File) => {
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
        
        // Map Excel columns to our API payload
        const mappedData = jsonData.map((item) => {
          const row = item as Record<string, unknown>;
          const fullName = String(row['Name'] || '').trim();
          const parts = fullName.split(' ');
          const firstName = parts[0] || '';
          const lastName = parts.slice(1).join(' ') || '-';

          return {
            employeeCode: String(row['Worker ID'] || '').trim(),
            firstName,
            lastName,
            departmentName: String(row['Department'] || '').trim(),
            jobProfile: row['Job Profile'] ? String(row['Job Profile']).trim() : undefined,
            mobileNumber: row['Mobile Number'] ? String(row['Mobile Number']).trim() : undefined,
            aadharNumber: row['Aadhar Number'] ? String(row['Aadhar Number']).trim() : undefined,
          };
        }).filter((row) => Boolean(row.employeeCode && row.firstName && row.departmentName)); // basic validation

        setParsedData(mappedData);
      } catch (err) {
        console.error('Error parsing excel:', err);
        alert('Failed to parse the Excel file. Please ensure it matches the template format.');
      } finally {
        setIsParsing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = () => {
    if (parsedData.length === 0) return;
    
    bulkImportMutation.mutate(parsedData, {
      onSuccess: () => {
        handleClose();
      }
    });
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Bulk Import Employees
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition"
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
        
        <div className="p-5 space-y-6">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
            <p className="font-semibold mb-1">How it works:</p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Download the template.</li>
              <li>Fill in the employee details (Do not change column names).</li>
              <li>Upload the completed `.xlsx` file below.</li>
            </ol>
            <button 
              onClick={handleDownloadTemplate}
              className="mt-3 text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
            >
              Download Template
            </button>
          </div>

          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label className="block text-sm font-medium text-gray-900 cursor-pointer">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Drag & Drop your Excel file here, or click to browse
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">Supports .xlsx, .xls, .csv</p>
          </div>

          {isParsing && <p className="text-sm text-gray-500">Parsing file...</p>}
          
          {parsedData.length > 0 && (
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview ({parsedData.length} valid rows found):</p>
              <div className="max-h-40 overflow-y-auto">
                <table className="w-full text-xs text-left text-gray-500">
                  <thead className="text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th className="px-2 py-1">Code</th>
                      <th className="px-2 py-1">Name</th>
                      <th className="px-2 py-1">Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-b border-gray-200">
                        <td className="px-2 py-1">{row.employeeCode}</td>
                        <td className="px-2 py-1">{row.firstName} {row.lastName}</td>
                        <td className="px-2 py-1">{row.departmentName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedData.length > 5 && (
                  <p className="text-center text-xs text-gray-400 mt-2">...and {parsedData.length - 5} more</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={bulkImportMutation.isPending}
              className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={parsedData.length === 0 || bulkImportMutation.isPending}
              className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition disabled:opacity-50"
            >
              {bulkImportMutation.isPending ? 'Importing...' : 'Import Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
