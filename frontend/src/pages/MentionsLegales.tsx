
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Home, Building, Globe } from 'lucide-react';

const MentionsLegales = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mentions légales</h1>
              <p className="text-gray-600 mt-2">Informations légales obligatoires</p>
            </div>
            <Button onClick={() => window.location.href = '/'} variant="outline">
              <Home className="mr-2 h-4 w-4 cursor-pointer" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Éditeur du site */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Éditeur du site
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Nom :</h3>
                <p>Yanis Triglia</p>
              </div>
              <div>
                <h3 className="font-semibold">Statut :</h3>
                <p>Étudiant à CESI - Développeur Full Stack</p>
              </div>
              <div>
                <h3 className="font-semibold">Adresse :</h3>
                <p>Marignane, France</p>
              </div>
              <div>
                <h3 className="font-semibold">Email :</h3>
                <p>
                  <a href="mailto:yanistrigl@gmail.com" className="text-blue-600 hover:underline">
                    yanistrigl@gmail.com
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Téléphone :</h3>
                <p>+33 6 48 62 25 13</p>
              </div>
            </CardContent>
          </Card>

          {/* Hébergement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Hébergement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Hébergeur :</h3>
                <p>02 Switch</p>
              </div>
              <div>
                <h3 className="font-semibold">Siège social :</h3>
                <p>France</p>
              </div>
              <div>
                <h3 className="font-semibold">Site web :</h3>
                <p>
                  <a href="https://www.o2switch.fr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    https://www.o2switch.fr/
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Propriété intellectuelle */}
          <Card>
            <CardHeader>
              <CardTitle>Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
                Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p>
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite 
                sauf autorisation expresse du directeur de la publication.
              </p>
            </CardContent>
          </Card>

          {/* Limitation de responsabilité */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation de responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, 
                mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
              </p>
              <p>
                Si vous constatez une lacune, erreur ou ce qui paraît être un dysfonctionnement, merci de bien vouloir 
                le signaler par email à l'adresse yanistrigl@gmail.com, en décrivant le problème de la manière la plus précise possible.
              </p>
            </CardContent>
          </Card>

          {/* Droit applicable */}
          <Card>
            <CardHeader>
              <CardTitle>Droit applicable</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Tout litige en relation avec l'utilisation du site .... est soumis au droit français. 
                En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents de Marseille.
              </p>
            </CardContent>
          </Card>
        </div>

   
      </main>
    </div>
  );
};

export default MentionsLegales;
