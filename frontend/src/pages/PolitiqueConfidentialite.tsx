
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Home, Shield, Database, Eye, Mail } from 'lucide-react';

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Politique de confidentialité</h1>
              <p className="text-gray-600 mt-2">Protection et gestion de vos données personnelles</p>
            </div>
            <Button onClick={() => window.location.href = '/'} variant="outline" className='cursor-pointer'>
              <Home className="mr-2 h-4 w-4 " />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                La présente Politique de confidentialité décrit la façon dont vos informations personnelles sont recueillies, 
                utilisées et partagées lorsque vous vous rendez sur à remplacer  ou que vous y effectuez un achat.
              </p>
              <p className="mt-4">
                En tant que responsable de traitement, je m'engage à protéger la confidentialité des informations personnelles 
                que vous pourriez être amenés à fournir sur ce site portfolio.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Données personnelles collectées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Formulaire de contact :</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse e-mail</li>
                  <li>Numéro de téléphone (optionnel)</li>
                  <li>Objet et contenu du message</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Données de navigation :</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Adresse IP</li>
                  <li>Type de navigateur</li>
                  <li>Pages visitées</li>
                  <li>Durée de visite</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Utilisation des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                Utilisation des données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Les données personnelles collectées sont utilisées pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Répondre à vos demandes de contact</li>
                <li>Améliorer le fonctionnement du site</li>
                <li>Analyser l'utilisation du site pour l'optimiser</li>
                <li>Respecter les obligations légales</li>
              </ul>
              <p className="mt-4 font-semibold">
                Aucune donnée personnelle n'est vendue, échangée ou transmise à des tiers sans votre consentement explicite, 
                sauf obligation légale.
              </p>
            </CardContent>
          </Card>

          {/* Conservation des données */}
          <Card>
            <CardHeader>
              <CardTitle>Conservation des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Formulaire de contact :</h3>
                <p>Les données sont conservées pendant 3 ans maximum après le dernier contact.</p>
              </div>
              <div>
                <h3 className="font-semibold">Données de navigation :</h3>
                <p>Les logs de connexion sont conservés pendant 12 mois maximum.</p>
              </div>
            </CardContent>
          </Card>

          {/* Droits des utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle>Vos droits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-moi à : 
                <a href="mailto:yanistrigl@gmail.com" className="text-blue-600 hover:underline ml-1">
                  yanistrigl@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Ce site utilise des cookies techniques nécessaires au bon fonctionnement du site.</p>
              <div>
                <h3 className="font-semibold">Types de cookies utilisés :</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Cookies de session (supprimés à la fermeture du navigateur)</li>
                  <li>Cookies de préférences (thème, langue)</li>
                </ul>
              </div>
              <p>
                Aucun cookie de suivi ou publicitaire n'est utilisé sans votre consentement explicite.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
                vous pouvez me contacter à :
              </p>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p><strong>Email :</strong> contact@à remplacer</p>
                <p><strong>Adresse :</strong> Aix-en-Provence, France</p>
              </div>
            </CardContent>
          </Card>
        </div>

   
      </main>
    </div>
  );
};

export default PolitiqueConfidentialite;
