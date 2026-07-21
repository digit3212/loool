
import React, { useState } from 'react';
import { 
  Activity, UserPlus, Flag, FileText, Settings, Users, Grid, 
  Shield, Bell, Check, X, CheckCircle, Trash2, Loader2, Clock
} from 'lucide-react';
import { Group } from '../../data/groupsData';
import { Post, User } from '../../types';

interface GroupAdminDashboardProps {
  viewingGroup: Group;
  currentUser: User;
  groupPosts: Post[];
  adminRequests: any[];
  adminReports: any[];
  adminLogs: any[];
  requirePostApproval: boolean;
  setRequirePostApproval: (val: boolean) => void;
  adminNotifications: boolean;
  setAdminNotifications: (val: boolean) => void;
  onApproveRequest: (id: string, name: string) => void;
  onRejectRequest: (id: string, name: string) => void;
  onResolveReport: (id: string, action: 'keep' | 'delete') => void;
  onEditGroup: () => void;
  showLocalNotification: (msg: string, type?: 'success' | 'info') => void;
  logAction: (action: string) => void;
}

const GroupAdminDashboard: React.FC<GroupAdminDashboardProps> = ({
  viewingGroup,
  currentUser,
  groupPosts,
  adminRequests,
  adminReports,
  adminLogs,
  requirePostApproval,
  setRequirePostApproval,
  adminNotifications,
  setAdminNotifications,
  onApproveRequest,
  onRejectRequest,
  onResolveReport,
  onEditGroup,
  showLocalNotification,
  logAction
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'requests' | 'reports' | 'logs'>('overview');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
        
        {/* Admin Sidebar Navigation */}
        <div className="md:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sticky top-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg border-b pb-2 dark:border-gray-700">لوحة التحكم</h3>
                <div className="space-y-2">
                    <button 
                        onClick={() => setActiveSection('overview')}
                        className={`w-full text-start px-3 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition ${activeSection === 'overview' ? 'bg-fb-blue text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                        <Activity className="w-4 h-4" /> نظرة عامة
                    </button>
                    <button 
                        onClick={() => setActiveSection('requests')}
                        className={`w-full text-start px-3 py-2.5 rounded-lg font-medium text-sm flex justify-between items-center transition ${activeSection === 'requests' ? 'bg-fb-blue text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                        <span className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> طلبات العضوية</span>
                        {adminRequests.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">{adminRequests.length}</span>}
                    </button>
                    <button 
                        onClick={() => setActiveSection('reports')}
                        className={`w-full text-start px-3 py-2.5 rounded-lg font-medium text-sm flex justify-between items-center transition ${activeSection === 'reports' ? 'bg-fb-blue text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                        <span className="flex items-center gap-2"><Flag className="w-4 h-4" /> الإبلاغات</span>
                        {adminReports.length > 0 && <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">{adminReports.length}</span>}
                    </button>
                    <button 
                        onClick={() => setActiveSection('logs')}
                        className={`w-full text-start px-3 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition ${activeSection === 'logs' ? 'bg-fb-blue text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                        <FileText className="w-4 h-4" /> سجل النشاطات
                    </button>
                    <button 
                        onClick={onEditGroup}
                        className="w-full text-start px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm flex items-center gap-2 transition"
                    >
                        <Settings className="w-4 h-4" /> إعدادات المجموعة
                    </button>
                </div>
            </div>
        </div>

        {/* Admin Content Area */}
        <div className="md:col-span-3 space-y-6">
            
            {/* OVERVIEW SECTION */}
            {activeSection === 'overview' && (
                <div className="space-y-6 animate-fadeIn">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full mb-2 text-fb-blue"><Users className="w-6 h-6" /></div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{viewingGroup.membersCount}</span>
                            <span className="text-xs text-gray-500">إجمالي الأعضاء</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full mb-2 text-green-600"><Grid className="w-6 h-6" /></div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{groupPosts.length}</span>
                            <span className="text-xs text-gray-500">منشورات هذا الشهر</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full mb-2 text-orange-600"><UserPlus className="w-6 h-6" /></div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{adminRequests.length}</span>
                            <span className="text-xs text-gray-500">طلبات معلقة</span>
                        </div>
                    </div>

                    {/* Quick Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-gray-500" />
                            إعدادات سريعة
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/30">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full text-purple-600"><Shield className="w-5 h-5" /></div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-900 dark:text-white">الموافقة على المنشورات</div>
                                        <div className="text-xs text-gray-500">يجب موافقة المسؤول قبل ظهور المنشور للعامة</div>
                                    </div>
                                </div>
                                <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
                                    <input 
                                        type="checkbox" 
                                        checked={requirePostApproval}
                                        onChange={() => {
                                            const newState = !requirePostApproval;
                                            setRequirePostApproval(newState);
                                            logAction(newState ? 'تفعيل الموافقة على المنشورات' : 'إيقاف الموافقة على المنشورات');
                                            showLocalNotification(newState ? 'تم تفعيل الموافقة المسبقة' : 'تم إيقاف الموافقة المسبقة', 'info');
                                        }}
                                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-green-400"
                                    />
                                    <div className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${requirePostApproval ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/30">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-fb-blue"><Bell className="w-5 h-5" /></div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-900 dark:text-white">إشعارات المسؤولين</div>
                                        <div className="text-xs text-gray-500">تلقي إشعارات عند حدوث نشاط مهم</div>
                                    </div>
                                </div>
                                <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
                                    <input 
                                        type="checkbox" 
                                        checked={adminNotifications}
                                        onChange={() => {
                                            const newState = !adminNotifications;
                                            setAdminNotifications(newState);
                                            showLocalNotification(newState ? 'تم تفعيل الإشعارات' : 'تم إيقاف الإشعارات', 'info');
                                        }}
                                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-green-400"
                                    />
                                    <div className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${adminNotifications ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* REQUESTS SECTION */}
            {activeSection === 'requests' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fadeIn">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <UserPlus className="w-6 h-6 text-fb-blue" />
                            طلبات العضوية المعلقة
                        </h3>
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-bold">{adminRequests.length} طلب</span>
                    </div>
                    
                    {adminRequests.length > 0 ? (
                        <div className="space-y-4">
                            {adminRequests.map((req) => (
                                <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-sm transition">
                                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                        <img src={req.avatar} alt="user" className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-600 object-cover shadow-sm" />
                                        <div>
                                            <div className="font-bold text-base text-gray-900 dark:text-white hover:text-fb-blue cursor-pointer">{req.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {req.time}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">12 صديق مشترك</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => onApproveRequest(req.id, req.name)}
                                            className="flex-1 sm:flex-none px-4 py-2 bg-fb-blue text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Check className="w-4 h-4" /> موافقة
                                        </button>
                                        <button 
                                            onClick={() => onRejectRequest(req.id, req.name)}
                                            className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500 text-sm font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition flex items-center justify-center gap-2"
                                        >
                                            <X className="w-4 h-4" /> رفض
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3 opacity-80" />
                            <h4 className="font-bold text-gray-900 dark:text-white">لا توجد طلبات معلقة</h4>
                            <p className="text-gray-500 text-sm mt-1">أنت على اطلاع بكل شيء!</p>
                        </div>
                    )}
                </div>
            )}

            {/* REPORTS SECTION */}
            {activeSection === 'reports' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fadeIn">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Flag className="w-6 h-6 text-orange-500" />
                        المحتوى المبلغ عنه
                    </h3>

                    {adminReports.length > 0 ? (
                        <div className="space-y-4">
                            {adminReports.map((report) => (
                                <div key={report.id} className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase">{report.type}</span>
                                            <span className="text-xs text-gray-500">تم الإبلاغ بواسطة <span className="font-bold">{report.reporter}</span></span>
                                        </div>
                                        <span className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">قيد المراجعة</span>
                                    </div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-4 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 italic">
                                        "{report.content}"
                                    </p>
                                    <div className="flex gap-3 justify-end">
                                        <button 
                                            onClick={() => onResolveReport(report.id, 'keep')}
                                            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-bold transition"
                                        >
                                            تجاهل (إبقاء المحتوى)
                                        </button>
                                        <button 
                                            onClick={() => onResolveReport(report.id, 'delete')}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-sm flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> حذف المحتوى
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <Shield className="w-16 h-16 text-emerald-500 mx-auto mb-3 opacity-80" />
                            <h4 className="font-bold text-gray-900 dark:text-white">المجموعة آمنة</h4>
                            <p className="text-gray-500 text-sm mt-1">لا توجد بلاغات جديدة لمراجعتها.</p>
                        </div>
                    )}
                </div>
            )}

            {/* LOGS SECTION */}
            {activeSection === 'logs' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fadeIn">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-gray-500" />
                        سجل نشاطات المشرفين
                    </h3>
                    
                    <div className="space-y-0 relative border-r-2 border-gray-200 dark:border-gray-700 mr-2 pr-6">
                        {adminLogs.map((log) => (
                            <div key={log.id} className="relative pb-6 last:pb-0">
                                <div className="absolute top-1 -right-[31px] w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full border-4 border-white dark:border-gray-800"></div>
                                <div className="flex justify-between items-start group hover:bg-gray-50 dark:hover:bg-gray-700/30 p-2 rounded-lg transition -mt-2">
                                    <div>
                                        <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">{log.action}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">بواسطة: <span className="text-fb-blue font-medium">{log.admin}</span></div>
                                    </div>
                                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{log.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default GroupAdminDashboard;
