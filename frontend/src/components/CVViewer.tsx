import  { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Download, FileText, Eye, EyeOff } from 'lucide-react';

const CVViewer = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const cvPath = '../../../public/pdf/cv.pdf';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2 h-6 w-6 text-blue-600" />
            Mon CV
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Masquer
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Visualiser
                </>
              )}
            </Button>
            <a href={cvPath} download>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </a>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!isExpanded ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              CV - Yanis Triglia
            </h3>
            <p className="text-gray-600 mb-6">
              Développeur Full Stack • Étudiant en Master
            </p>
            <Button
              onClick={() => setIsExpanded(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="mr-2 h-4 w-4" />
              Visualiser le CV
            </Button>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <iframe
              src={`${cvPath}#toolbar=0&navpanes=0`}
              title="CV PDF Viewer"
              className="w-full h-[80vh]"
              style={{ border: 'none' }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CVViewer;
