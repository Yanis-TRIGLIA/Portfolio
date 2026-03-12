import CVViewer from '../components/CVViewer';

const CVSection = () => {
  return (
    <section id="cv" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 font-serif text-gray-800 leading-tight categories">
          Curriculum Vitae
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pl-3 pr-3">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Un CV toujours à jour</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Vous trouverez ici la version la plus récente de mon CV, régulièrement mise à jour pour refléter mes nouvelles expériences, compétences et projets.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Il met en avant mon parcours académique, mes expériences professionnelles ainsi que les technologies que je maîtrise. Chaque opportunité est pour moi une occasion d'apprendre et d’évoluer dans le monde du développement logiciel.
            </p>
            <p className="text-gray-600 leading-relaxed">
              N'hésitez pas à le consulter et à me contacter pour toute opportunité ou collaboration. Mon profil est en constante évolution.
            </p>
          </div>

          <div>
            <CVViewer />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CVSection;
