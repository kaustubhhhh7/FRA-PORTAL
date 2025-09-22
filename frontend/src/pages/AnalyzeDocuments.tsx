import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft } from 'lucide-react';

const OCR_API_URL = (import.meta as any)?.env?.VITE_OCR_API_URL || 'http://localhost:8585/ocr';

const AnalyzeDocuments: React.FC = () => {
	const [activeTab, setActiveTab] = useState('dashboard');
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [result, setResult] = useState('');
	const isMobile = useIsMobile();
	const navigate = useNavigate();

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;
		setIsUploading(true);
		setResult('');
    try {
			const formData = new FormData();
			formData.append('file', file);
			const res = await fetch(OCR_API_URL, {
				method: 'POST',
				body: formData
			});
      if (!res.ok) {
        let errText = `OCR request failed: ${res.status}`;
        try {
          const data = await res.json();
          if (data && (data.error || data.message)) {
            errText = `OCR error: ${data.error || data.message}`;
          }
        } catch {}
        setResult(errText);
        return;
      }
      const data = await res.json();
      setResult(data.text || '');
		} catch (err: any) {
			setResult(`Error: ${err.message || 'Failed to process document'}`);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<Header activeTab={activeTab} onTabChange={setActiveTab} />
			<div className="flex-1 p-4">
				<div className="max-w-3xl mx-auto">
					{/* Back Button */}
					<div className="mb-4">
						<Button
							variant="outline"
							onClick={() => navigate('/government-dashboard')}
							className="flex items-center gap-2"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Dashboard
						</Button>
					</div>
					
					<Card className="border-2">
						<CardHeader>
							<CardTitle>Analyze Documents (OCR)</CardTitle>
							<CardDescription>Upload an FRA-related image or PDF. The service extracts text for review.</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={onSubmit} className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-1">Select image or PDF</label>
									<Input type="file" accept="image/*,.pdf" onChange={onFileChange} required />
								</div>
								<Button type="submit" disabled={!file || isUploading} className="bg-black text-white hover:bg-gray-800">
									{isUploading ? 'Processing…' : 'Run OCR'}
								</Button>
							</form>

							{result && (
								<div className="mt-6">
									<label className="block text-sm font-medium mb-1">Extracted Text</label>
									<Textarea value={result} onChange={(e) => setResult(e.target.value)} rows={12} />
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default AnalyzeDocuments;


