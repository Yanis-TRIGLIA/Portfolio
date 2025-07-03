

const AccessDenied = () => {

    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Accès Refusé</h1>
            <p className="text-lg text-gray-700 mb-6">Vous n'avez pas la permission de voir cette page</p>
            <a href="/" className="text-blue-500 hover:underline">Retour à l'accueil</a>
        </div>
    )
}

export default AccessDenied;