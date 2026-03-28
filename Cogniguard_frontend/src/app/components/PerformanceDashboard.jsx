import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const PerformanceDashboard = () => {
    const [uploadData, setUploadData] = useState([]);
    const [downloadData, setDownloadData] = useState([]);

    useEffect(() => {
        // Fetch upload metrics
        fetch('/api/metrics/upload')
            .then(res => res.json())
            .then(data => setUploadData(data));

        // Fetch download metrics
        fetch('/api/metrics/download')
            .then(res => res.json())
            .then(data => setDownloadData(data));
    }, []);

    return (
        <div className="metrics-container space-y-8">
            <div className="upload-chart">
                <h3 className="text-sm font-semibold mb-2 text-secondary">Upload Speed (ms)</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={uploadData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        {/* FIX: backend bhej raha hai "name" */}
                        <XAxis dataKey="name" stroke="#666" fontSize={12} /> 
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                        {/* FIX: backend bhej raha hai "speed" */}
                        <Line type="monotone" dataKey="speed" stroke="#00D1FF" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="download-chart">
                <h3 className="text-sm font-semibold mb-2 text-secondary">Download Speed (ms)</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={downloadData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        {/* FIX: backend bhej raha hai "name" */}
                        <XAxis dataKey="name" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                        {/* FIX: backend bhej raha hai "speed" */}
                        <Line type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceDashboard;