import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Система управления заказами
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Современное веб-приложение для управления заказами услуг
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            <Link 
              href="/admin" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Админ панель
            </Link>
            <Link 
              href="/signup" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Регистрация
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Управление услугами</h3>
              <p className="text-gray-600">Создавайте и редактируйте услуги, управляйте категориями</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Обработка заказов</h3>
              <p className="text-gray-600">Принимайте и обрабатывайте заказы от клиентов</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Партнерская система</h3>
              <p className="text-gray-600">Управляйте партнерами и их услугами</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
