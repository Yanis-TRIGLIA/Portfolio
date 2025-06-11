import CVViewer from '../components/CVViewer';

const CVSection = () => {
  return (
    <section id="cv" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 font-serif text-gray-800 leading-tight categories">
          Mon CV
        </h2>
        <div className="max-w-4xl mx-auto">
          <CVViewer />
        </div>
      </div>
    </section>
  );
};

export default CVSection;
