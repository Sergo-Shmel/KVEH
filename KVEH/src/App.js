import React, { useState, useEffect, useRef } from 'react';
import {
    Upload, FileText, CheckCircle, AlertCircle, Download,
    Send, History, BarChart3, CreditCard, Settings, Menu,
    X, ChevronRight, Search, Bell, User, Loader2, Eye,
    Trash2, RefreshCw, Save, FileCheck, MessageSquare,
    Clock, TrendingUp, DollarSign, Award, Plus, Check,
    AlertTriangle, Info, ExternalLink, Copy, Filter
} from 'lucide-react';

// Симуляция WebSocket для демонстрации
const useWebSocket = (url) => {
    const [status, setStatus] = useState('disconnected');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('connected');
            // Симуляция получения сообщений
            const interval = setInterval(() => {
                setMessages(prev => [...prev, {
                    type: 'task_update',
                    data: { progress: Math.random() * 100 }
                }]);
            }, 5000);

            return () => clearInterval(interval);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return { status, messages };
};

// Компонент drag-and-drop для загрузки файлов
const FileUploader = ({ onFilesAdded }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFilesAdded(Array.from(e.dataTransfer.files));
        }
    };

    return (
        <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700">
                Перетащите файлы сюда или нажмите для выбора
            </p>
            <p className="text-sm text-gray-500 mt-2">
                Поддерживаются: DOCX, XLSX, PDF, PNG, JPG
            </p>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".docx,.xlsx,.pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => onFilesAdded(Array.from(e.target.files))}
            />
        </div>
    );
};

// Компонент прогресс-бара
const ProgressBar = ({ steps, currentStep }) => {
    return (
        <div className="flex flex-col space-y-2">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${index < currentStep ? 'bg-green-500 text-white' :
                        index === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    <div className={`ml-3 text-sm ${index === currentStep ? 'font-medium' : ''}`}>
                        {step}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Компонент таблицы файлов
const FilesTable = ({ files, onRemove, onView }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Название
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Тип
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                    <tr key={file.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {file.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {file.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${file.status === 'parsed' ? 'bg-green-100 text-green-800' :
                    file.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}`}>
                  {file.status === 'parsed' ? '🟢 Обработан' :
                      file.status === 'processing' ? '🟡 OCR' : '⏳ Ожидает'}
                </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                                onClick={() => onView(file)}
                                className="text-blue-600 hover:text-blue-900"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onRemove(file.id)}
                                className="text-red-600 hover:text-red-900"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

// Компонент KPI-дашборда
const KPIDashboard = () => {
    const kpiData = {
        timeReduction: { current: 18, average: 25, target: 20 },
        applications: { submitted: 47, won: 31, winRate: 66 },
        savings: { hours: 312, money: 1248000 }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Время подготовки</h3>
                        <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600">{kpiData.timeReduction.current} мин</div>
                    <p className="text-sm text-gray-500 mt-2">
                        В среднем: {kpiData.timeReduction.average} мин
                    </p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(kpiData.timeReduction.target / kpiData.timeReduction.current) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Успешность заявок</h3>
                        <Award className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-3xl font-bold text-green-600">{kpiData.applications.winRate}%</div>
                    <p className="text-sm text-gray-500 mt-2">
                        Выиграно: {kpiData.applications.won} из {kpiData.applications.submitted}
                    </p>
                    <div className="mt-4 flex items-center justify-center">
                        <div className="relative w-24 h-24">
                            <svg className="transform -rotate-90 w-24 h-24">
                                <circle cx="48" cy="48" r="36" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                                <circle
                                    cx="48" cy="48" r="36"
                                    stroke="#10B981"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 36 * kpiData.applications.winRate / 100} ${2 * Math.PI * 36}`}
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Экономия</h3>
                        <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                        {(kpiData.savings.money / 1000000).toFixed(2)}М ₽
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Сэкономлено часов: {kpiData.savings.hours}
                    </p>
                    <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Этот месяц</span>
                            <span className="text-green-600">+15%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '75%' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Динамика показателей</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">График временной динамики</p>
                </div>
            </div>
        </div>
    );
};

// Главный компонент приложения
export default function TenderAssistantApp() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeScreen, setActiveScreen] = useState('upload');
    const [files, setFiles] = useState([]);
    const [ikz, setIkz] = useState('');
    const [planContent, setPlanContent] = useState('');
    const [notifications, setNotifications] = useState(3);
    const { status: wsStatus } = useWebSocket('ws://localhost:8080');

    const steps = [
        'Загрузка документов',
        'Формирование плана',
        'Итоговый документ',
        'Отправка'
    ];

    const currentStep = activeScreen === 'upload' ? 0 :
        activeScreen === 'plan' ? 1 :
            activeScreen === 'final' ? 2 : 3;

    const handleFilesAdded = (newFiles) => {
        const processedFiles = newFiles.map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            type: file.name.split('.').pop().toUpperCase(),
            status: 'processing',
            file: file
        }));

        setFiles([...files, ...processedFiles]);

        // Симуляция обработки файлов
        processedFiles.forEach((file, index) => {
            setTimeout(() => {
                setFiles(prev => prev.map(f =>
                    f.id === file.id ? { ...f, status: 'parsed' } : f
                ));
            }, 2000 + index * 1000);
        });
    };

    const handleIKZSubmit = async () => {
        if (!ikz) return;

        // Симуляция загрузки документов из ЕИС
        const eisFiles = [
            { id: Date.now(), name: 'Техническое_задание.docx', type: 'DOCX', status: 'parsed' },
            { id: Date.now() + 1, name: 'Проект_договора.docx', type: 'DOCX', status: 'parsed' },
            { id: Date.now() + 2, name: 'Обоснование_НМЦК.xlsx', type: 'XLSX', status: 'parsed' },
            { id: Date.now() + 3, name: 'Критерии_оценки.pdf', type: 'PDF', status: 'processing' }
        ];

        setFiles([...files, ...eisFiles]);

        // Обновляем статус последнего файла
        setTimeout(() => {
            setFiles(prev => prev.map(f => ({ ...f, status: 'parsed' })));
        }, 3000);
    };

    const menuItems = [
        { id: 'upload', label: 'Загрузка документов', icon: Upload },
        { id: 'plan', label: 'План предложения', icon: FileText },
        { id: 'final', label: 'Итоговый документ', icon: FileCheck },
        { id: 'history', label: 'История сессий', icon: History },
        { id: 'kpi', label: 'KPI-дашборд', icon: BarChart3 },
        { id: 'payment', label: 'Оплата токенов', icon: CreditCard },
        { id: 'admin', label: 'Администрирование', icon: Settings, role: 'admin' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-1.5 rounded-md hover:bg-gray-100 lg:hidden"
                            >
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                            <div className="ml-4 flex items-center">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="ml-3 text-lg font-semibold text-gray-900">AI-ассистент КФЭХ</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Поиск..."
                                    className="pl-10 pr-4 py-1.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                                <Bell className="w-5 h-5 text-gray-600" />
                                {notifications > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                )}
                            </button>

                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <User className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed lg:static lg:translate-x-0 z-40 w-64 h-[calc(100vh-56px)] bg-white border-r border-gray-200 
          transition-transform duration-300 ease-in-out`}>
                    <div className="p-4 space-y-2">
                        <div className="mb-6">
                            <ProgressBar steps={steps} currentStep={currentStep} />
                        </div>

                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveScreen(item.id)}
                                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${activeScreen === item.id
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <Icon className="w-4 h-4 mr-3" />
                                        {item.label}
                                        {activeScreen === item.id && (
                                            <ChevronRight className="w-4 h-4 ml-auto" />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="pt-6 mt-6 border-t border-gray-200">
                            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                                Статус системы
                            </div>
                            <div className="px-3 py-1 flex items-center text-sm">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                    wsStatus === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                                <span className="text-gray-600">
                  {wsStatus === 'connected' ? 'Подключено' : 'Отключено'}
                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6 overflow-auto">
                    {activeScreen === 'upload' && (
                        <div className="max-w-6xl mx-auto space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Загрузка документов</h2>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ИКЗ / Ссылка на ЕИС
                                    </label>
                                    <div className="flex space-x-3">
                                        <input
                                            type="text"
                                            value={ikz}
                                            onChange={(e) => setIkz(e.target.value)}
                                            placeholder="Введите ИКЗ или ссылку"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleIKZSubmit}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Подтянуть
                                        </button>
                                    </div>
                                </div>

                                <FileUploader onFilesAdded={handleFilesAdded} />

                                {files.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Загруженные файлы</h3>
                                        <FilesTable
                                            files={files}
                                            onRemove={(id) => setFiles(files.filter(f => f.id !== id))}
                                            onView={(file) => console.log('View file:', file)}
                                        />
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end">
                                    <button
                                        disabled={files.filter(f => f.status === 'parsed').length === 0}
                                        onClick={() => setActiveScreen('plan')}
                                        className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center
                      ${files.filter(f => f.status === 'parsed').length > 0
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        Сформировать план
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-2xl p-6">
                                <div className="flex items-start">
                                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div className="ml-3">
                                        <h4 className="text-sm font-medium text-blue-900">Подсказка</h4>
                                        <p className="mt-1 text-sm text-blue-700">
                                            Вы можете загрузить сразу несколько файлов, перетащив их в область загрузки.
                                            Система автоматически распознает тип документа и извлечет необходимую информацию.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeScreen === 'plan' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">План предложения</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-1">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Структура документа</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                            {[
                                                'Общие сведения об участнике',
                                                'Квалификация персонала',
                                                'Опыт выполнения работ',
                                                'Материально-техническая база',
                                                'Методология выполнения',
                                                'Гарантийные обязательства'
                                            ].map((section, index) => (
                                                <div
                                                    key={index}
                                                    className="px-3 py-2 bg-white rounded-lg hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between"
                                                >
                                                    <span className="text-sm">{section}</span>
                                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-700">Редактор</h3>
                                            <div className="flex space-x-2">
                                                <button className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
                                                    Сверить с требованиями
                                                </button>
                                                <button className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
                                                    Добавить НПА
                                                </button>
                                                <button className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border border-gray-200 rounded-lg p-4 min-h-[400px]">
                      <textarea
                          value={planContent}
                          onChange={(e) => setPlanContent(e.target.value)}
                          className="w-full h-full resize-none focus:outline-none"
                          placeholder="Начните вводить текст плана..."
                      />
                                        </div>

                                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <div className="flex items-start">
                                                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                                <div className="ml-3">
                                                    <h4 className="text-sm font-medium text-yellow-900">Обнаружены несоответствия</h4>
                                                    <p className="mt-1 text-sm text-yellow-700">
                                                        В разделе "Квалификация персонала" не указан требуемый стаж работы специалистов.
                                                    </p>
                                                    <button className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900">
                                                        Исправить автоматически →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={() => setActiveScreen('upload')}
                                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                                    >
                                        Назад
                                    </button>
                                    <button
                                        onClick={() => setActiveScreen('final')}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center"
                                    >
                                        Собрать итоговый документ
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeScreen === 'final' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Итоговый документ</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Предпросмотр документа</h3>
                                        <div className="border border-gray-200 rounded-lg p-4 h-[500px] overflow-auto bg-gray-50">
                                            <p className="text-sm text-gray-600">
                                                Здесь отображается итоговый документ КФЭХ...
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Таблица соответствия</h3>
                                        <div className="space-y-3">
                                            {[
                                                { requirement: 'Опыт работы не менее 5 лет', status: 'ok' },
                                                { requirement: 'Наличие лицензии СРО', status: 'ok' },
                                                { requirement: 'Финансовая устойчивость', status: 'warning' },
                                                { requirement: 'Квалификация персонала', status: 'ok' },
                                                { requirement: 'Материально-техническая база', status: 'error' }
                                            ].map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 rounded-lg border ${
                                                        item.status === 'ok' ? 'bg-green-50 border-green-200' :
                                                            item.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                                                                'bg-red-50 border-red-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">{item.requirement}</span>
                                                        {item.status === 'ok' ? (
                                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                                        ) : item.status === 'warning' ? (
                                                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                                                        ) : (
                                                            <X className="w-5 h-5 text-red-600" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 bg-blue-50 rounded-lg p-4">
                                            <h4 className="text-sm font-medium text-blue-900 mb-2">AI-рекомендации</h4>
                                            <ul className="space-y-2 text-sm text-blue-700">
                                                <li>• Добавить подтверждение финансовой устойчивости</li>
                                                <li>• Уточнить состав материально-технической базы</li>
                                                <li>• Проверить актуальность лицензий</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between items-center">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setActiveScreen('plan')}
                                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                                        >
                                            Вернуть в план
                                        </button>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button className="px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center">
                                            <Download className="w-4 h-4 mr-2" />
                                            DOCX
                                        </button>
                                        <button className="px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center">
                                            <Download className="w-4 h-4 mr-2" />
                                            PDF
                                        </button>
                                        <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center">
                                            <Send className="w-4 h-4 mr-2" />
                                            Отправить на подпись
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeScreen === 'history' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">История сессий</h2>
                                    <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Фильтры
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        {
                                            id: 1,
                                            date: '10.06.2025',
                                            ikz: '0123456789012345678901234567890123',
                                            status: 'completed',
                                            duration: '18 мин',
                                            title: 'Поставка медицинского оборудования'
                                        },
                                        {
                                            id: 2,
                                            date: '09.06.2025',
                                            ikz: '0123456789012345678901234567890134',
                                            status: 'in_progress',
                                            duration: '25 мин',
                                            title: 'Техническое обслуживание ИТ-инфраструктуры'
                                        },
                                        {
                                            id: 3,
                                            date: '08.06.2025',
                                            ikz: '0123456789012345678901234567890145',
                                            status: 'draft',
                                            duration: '12 мин',
                                            title: 'Поставка канцелярских товаров'
                                        }
                                    ].map((session) => (
                                        <div key={session.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-medium text-gray-900">{session.title}</h3>
                                                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                                        <span>{session.date}</span>
                                                        <span>•</span>
                                                        <span>ИКЗ: {session.ikz}</span>
                                                        <span>•</span>
                                                        <span>{session.duration}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium
                            ${session.status === 'completed' ? 'bg-green-100 text-green-800' :
                              session.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'}`}>
                            {session.status === 'completed' ? 'Готово' :
                                session.status === 'in_progress' ? 'В работе' : 'Черновик'}
                          </span>
                                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                                        Открыть
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-800">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeScreen === 'kpi' && <KPIDashboard />}

                    {activeScreen === 'payment' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Оплата токенов</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Текущий баланс</h3>
                                        <div className="text-3xl font-bold text-blue-600">245,000</div>
                                        <p className="text-sm text-gray-500 mt-1">токенов</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Расход за месяц</h3>
                                        <div className="text-3xl font-bold text-gray-900">89,450</div>
                                        <p className="text-sm text-gray-500 mt-1">токенов использовано</p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-medium text-gray-900 mb-4">Тарифные планы</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    {[
                                        { name: 'Базовый', tokens: 100000, price: 15000 },
                                        { name: 'Профессиональный', tokens: 500000, price: 60000, popular: true },
                                        { name: 'Корпоративный', tokens: 2000000, price: 200000 }
                                    ].map((plan) => (
                                        <div
                                            key={plan.name}
                                            className={`border rounded-lg p-6 ${
                                                plan.popular ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'
                                            }`}
                                        >
                                            {plan.popular && (
                                                <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full mb-3">
                          Популярный
                        </span>
                                            )}
                                            <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                                            <div className="mt-2 text-3xl font-bold text-gray-900">
                                                {plan.tokens.toLocaleString()}
                                            </div>
                                            <p className="text-sm text-gray-500">токенов</p>
                                            <div className="mt-4 text-2xl font-bold text-gray-900">
                                                {plan.price.toLocaleString()} ₽
                                            </div>
                                            <button className={`mt-6 w-full py-2 rounded-lg font-medium transition-colors
                        ${plan.popular
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                                                Выбрать
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <h3 className="text-lg font-medium text-gray-900 mb-4">История операций</h3>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Операция</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Токены</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Баланс</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {[
                                            { date: '10.06.2025', operation: 'Генерация КФЭХ', tokens: -12500, balance: 245000 },
                                            { date: '09.06.2025', operation: 'Пополнение', tokens: +100000, balance: 257500 },
                                            { date: '08.06.2025', operation: 'Генерация КФЭХ', tokens: -8900, balance: 157500 }
                                        ].map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.date}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.operation}</td>
                                                <td className={`px-6 py-4 text-sm font-medium ${
                                                    item.tokens > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {item.tokens > 0 ? '+' : ''}{item.tokens.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.balance.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeScreen === 'admin' && (
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Администрирование</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <button className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                                        <User className="w-8 h-8 text-gray-600 mb-3" />
                                        <h3 className="text-lg font-medium text-gray-900">Пользователи и роли</h3>
                                        <p className="text-sm text-gray-500 mt-1">Управление доступом</p>
                                    </button>

                                    <button className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                                        <Settings className="w-8 h-8 text-gray-600 mb-3" />
                                        <h3 className="text-lg font-medium text-gray-900">Настройки системы</h3>
                                        <p className="text-sm text-gray-500 mt-1">Лимиты и параметры</p>
                                    </button>

                                    <button className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                                        <History className="w-8 h-8 text-gray-600 mb-3" />
                                        <h3 className="text-lg font-medium text-gray-900">Журнал событий</h3>
                                        <p className="text-sm text-gray-500 mt-1">Аудит действий</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}