import React from 'react';
import { Plus, X, Edit, Loader2, Save, UserCog, UserPlus, Shield, Trash2, AlertTriangle, Globe, Mail, Phone, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PageModalsProps {
  showCreateModal: boolean;
  setShowCreateModal: (val: boolean) => void;
  newPageName: string;
  setNewPageName: (val: string) => void;
  newPageCategory: string;
  setNewPageCategory: (val: string) => void;
  newPageDesc: string;
  setNewPageDesc: (val: string) => void;
  isCreating: boolean;
  handleCreatePage: () => void;

  showEditPageModal: boolean;
  setShowEditPageModal: (val: boolean) => void;
  editPageName: string;
  setEditPageName: (val: string) => void;
  editPageCategory: string;
  setEditPageCategory: (val: string) => void;
  editPageDesc: string;
  setEditPageDesc: (val: string) => void;
  editPageWebsite: string;
  setEditPageWebsite: (val: string) => void;
  editPageEmail: string;
  setEditPageEmail: (val: string) => void;
  editPagePhone: string;
  setEditPagePhone: (val: string) => void;
  isUpdating: boolean;
  handleSavePageChanges: () => void;

  showRolesModal: boolean;
  setShowRolesModal: (val: boolean) => void;
  roleSearchTerm: string;
  setRoleSearchTerm: (val: string) => void;
  selectedRoleType: 'admin' | 'moderator';
  setSelectedRoleType: (val: 'admin' | 'moderator') => void;
  handleAddRole: () => void;
  handleRemoveRole: (id: string, role: string) => void;
  viewingPage: any;
  currentUser: any;

  confirmModal: { isOpen: boolean; pageId: string | null; pageName: string };
  closeConfirmModal: () => void;
  executeDeletePage: () => void;
  isDeleting: boolean;

  categories: { id: string; label: string }[];
}

const PageModals: React.FC<PageModalsProps> = (props) => {
  const { t, language, dir } = useLanguage();

  // Determine text direction class for inputs
  const textAlignClass = dir === 'rtl' ? 'text-right' : 'text-left';

  return (
    <>
      {/* Create Modal */}
      {props.showCreateModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh]">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <Plus className="w-5 h-5 text-fb-blue dark:text-emerald-500" />
                          {t.pages_create_modal_title || (language === 'ar' ? 'إنشاء صفحة جديدة' : 'Create New Page')}
                      </h3>
                      <button onClick={() => props.setShowCreateModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400 rounded-full p-1.5 transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                              {t.pages_page_name || (language === 'ar' ? 'اسم الصفحة' : 'Page Name')}
                          </label>
                          <input 
                            type="text" 
                            className={`w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-fb-blue dark:focus:ring-emerald-500 focus:border-transparent transition shadow-sm ${textAlignClass}`}
                            placeholder={language === 'ar' ? 'أدخل اسم الصفحة...' : 'Enter page name...'}
                            value={props.newPageName} 
                            onChange={(e) => props.setNewPageName(e.target.value)} 
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                              {t.pages_page_category || (language === 'ar' ? 'الفئة' : 'Category')}
                          </label>
                          <div className="relative">
                              <select 
                                className={`w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-fb-blue dark:focus:ring-emerald-500 focus:border-transparent transition shadow-sm appearance-none cursor-pointer ${textAlignClass}`} 
                                value={props.newPageCategory} 
                                onChange={(e) => props.setNewPageCategory(e.target.value)}
                              >
                                  {props.categories.map((cat) => (
                                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                                  ))}
                              </select>
                              <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400 ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
                                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                              </div>
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                              {t.pages_page_desc || (language === 'ar' ? 'الوصف' : 'Description')} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">({language === 'ar' ? 'اختياري' : 'Optional'})</span>
                          </label>
                          <textarea 
                            className={`w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-fb-blue dark:focus:ring-emerald-500 focus:border-transparent transition shadow-sm h-28 resize-none ${textAlignClass}`} 
                            placeholder={language === 'ar' ? 'اكتب وصفاً مختصراً للصفحة...' : 'Write a short description...'}
                            value={props.newPageDesc} 
                            onChange={(e) => props.setNewPageDesc(e.target.value)} 
                          />
                      </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                      <button 
                        onClick={() => props.setShowCreateModal(false)} 
                        className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition text-sm"
                      >
                        {t.common_cancel || (language === 'ar' ? 'إلغاء' : 'Cancel')}
                      </button>
                      <button 
                        onClick={props.handleCreatePage} 
                        disabled={props.isCreating} 
                        className="px-6 py-2.5 bg-fb-blue text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2 disabled:opacity-70 text-sm active:scale-95"
                      >
                        {props.isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t.common_create || (language === 'ar' ? 'إنشاء' : 'Create')}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Edit Modal */}
      {props.showEditPageModal && (
          <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col border border-gray-100 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <Edit className="w-5 h-5 text-fb-blue dark:text-emerald-500" />
                          {t.pages_edit_page || (language === 'ar' ? 'تعديل الصفحة' : 'Edit Page')}
                      </h3>
                      <button onClick={() => props.setShowEditPageModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400 rounded-full p-1.5 transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>

                  <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                             {t.pages_page_name || (language === 'ar' ? 'اسم الصفحة' : 'Page Name')}
                          </label>
                          <input 
                             type="text" 
                             className={`w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-fb-blue dark:focus:ring-emerald-500 transition ${textAlignClass}`} 
                             value={props.editPageName} 
                             onChange={(e) => props.setEditPageName(e.target.value)} 
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                             {t.pages_page_category || (language === 'ar' ? 'الفئة' : 'Category')}
                          </label>
                          <div className="relative">
                              <select 
                                className={`w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-fb-blue dark:focus:ring-emerald-500 transition appearance-none cursor-pointer ${textAlignClass}`} 
                                value={props.editPageCategory} 
                                onChange={(e) => props.setEditPageCategory(e.target.value)}
                              >
                                  {props.categories.map((cat) => (
                                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                                  ))}
                              </select>
                              <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400 ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
                                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                              </div>
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                             {t.pages_page_desc || (language === 'ar' ? 'الوصف' : 'Description')}
                          </label>
                          <textarea 
                             className={`w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-fb-blue dark:focus:ring-emerald-500 transition h-24 resize-none ${textAlignClass}`} 
                             value={props.editPageDesc} 
                             onChange={(e) => props.setEditPageDesc(e.target.value)} 
                          />
                      </div>
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                          <label className="block text-sm font-extrabold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider px-1">
                             {t.pages_contact || (language === 'ar' ? 'معلومات الاتصال' : 'Contact Info')}
                          </label>
                          <div className="space-y-4">
                              <div className="relative">
                                  <Globe className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
                                  <input 
                                     type="text" 
                                     className={`w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2.5 ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'} text-sm outline-none focus:ring-2 focus:ring-fb-blue dark:focus:ring-emerald-500 transition`} 
                                     placeholder={t.profile_about_website || (language === 'ar' ? 'موقع الويب' : 'Website')}
                                     value={props.editPageWebsite} 
                                     onChange={(e) => props.setEditPageWebsite(e.target.value)} 
                                  />
                              </div>
                              <div className="relative">
                                  <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
                                  <input 
                                     type="email" 
                                     className={`w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2.5 ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'} text-sm outline-none focus:ring-2 focus:ring-fb-blue dark:focus:ring-emerald-500 transition`} 
                                     placeholder={t.profile_about_email || (language === 'ar' ? 'البريد الإلكتروني' : 'Email')}
                                     value={props.editPageEmail} 
                                     onChange={(e) => props.setEditPageEmail(e.target.value)} 
                                  />
                              </div>
                              <div className="relative">
                                  <Phone className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
                                  <input 
                                     type="tel" 
                                     className={`w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2.5 ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'} text-sm outline-none focus:ring-2 focus:ring-fb-blue dark:focus:ring-emerald-500 transition`} 
                                     placeholder={t.profile_about_mobile || (language === 'ar' ? 'الهاتف' : 'Phone')}
                                     value={props.editPagePhone} 
                                     onChange={(e) => props.setEditPagePhone(e.target.value)} 
                                  />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                      <button 
                        onClick={() => props.setShowEditPageModal(false)} 
                        className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition text-sm"
                      >
                        {t.common_cancel || (language === 'ar' ? 'إلغاء' : 'Cancel')}
                      </button>
                      <button 
                        onClick={props.handleSavePageChanges} 
                        disabled={props.isUpdating} 
                        className="px-6 py-2.5 bg-fb-blue text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2 disabled:opacity-70 text-sm active:scale-95"
                      >
                        {props.isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {t.common_save || (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Roles Modal */}
      {props.showRolesModal && props.viewingPage && (
          <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn flex flex-col max-h-[80vh] border border-gray-100 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <UserCog className="w-5 h-5 text-fb-blue dark:text-emerald-500" />
                          {t.pages_manage_roles || (language === 'ar' ? 'أدوار الصفحة' : 'Page Roles')}
                      </h3>
                      <button onClick={() => props.setShowRolesModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400 rounded-full p-1.5 transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                      <div className="mb-6 bg-blue-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-blue-100 dark:border-emerald-800/30">
                          <h4 className="font-bold text-sm text-fb-blue dark:text-emerald-500 mb-3 flex items-center gap-2">
                              <UserPlus className="w-4 h-4" /> 
                              {t.pages_assign_role || (language === 'ar' ? 'تعيين دور جديد' : 'Assign New Role')}
                          </h4>
                          <div className="flex gap-2 mb-3">
                              <div className="flex-1 relative">
                                  <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
                                  <input 
                                      type="text" 
                                      placeholder={t.groups_search_member || (language === 'ar' ? 'اكتب اسم مستخدم...' : 'Search for a user...')}
                                      className={`w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2.5 ${dir === 'rtl' ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-sm focus:ring-2 focus:ring-fb-blue dark:focus:ring-emerald-500 outline-none transition`} 
                                      value={props.roleSearchTerm} 
                                      onChange={(e) => props.setRoleSearchTerm(e.target.value)} 
                                  />
                              </div>
                              <select 
                                  className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-fb-blue dark:focus:ring-emerald-500 outline-none transition cursor-pointer"
                                  value={props.selectedRoleType} 
                                  onChange={(e) => props.setSelectedRoleType(e.target.value as any)}
                              >
                                  <option value="moderator">{t.common_moderator || (language === 'ar' ? 'مشرف' : 'Moderator')}</option>
                                  <option value="admin">{t.common_admin || (language === 'ar' ? 'مسؤول' : 'Admin')}</option>
                              </select>
                          </div>
                          <button 
                            onClick={props.handleAddRole} 
                            disabled={!props.roleSearchTerm.trim()} 
                            className="w-full bg-fb-blue text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-sm active:scale-95"
                          >
                            {t.common_add || (language === 'ar' ? 'إضافة' : 'Add')}
                          </button>
                      </div>

                      <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                              <div className="flex items-center gap-3">
                                  <img src={props.currentUser.avatar} alt="owner" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
                                  <div>
                                      <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1">
                                          {props.currentUser.name}
                                          <Shield className="w-3 h-3 text-yellow-500 fill-current" />
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">{t.common_owner || (language === 'ar' ? 'المالك' : 'Owner')}</div>
                                  </div>
                              </div>
                          </div>
                          
                          {props.viewingPage.membersList.map((member: any) => (
                              <div key={member.userId} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-sm transition">
                                  <div className="flex items-center gap-3">
                                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                      <div>
                                          <div className="font-bold text-sm text-gray-900 dark:text-white">{member.name}</div>
                                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                              {member.role === 'admin' 
                                                ? <span className="text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-1.5 rounded">{t.common_admin || 'مسؤول'}</span> 
                                                : <span className="text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-1.5 rounded">{t.common_moderator || 'مشرف'}</span>
                                              }
                                              <span className="opacity-70">• {language === 'ar' ? 'منذ' : 'since'} {member.joinedAt}</span>
                                          </div>
                                      </div>
                                  </div>
                                  <button 
                                    onClick={() => props.handleRemoveRole(member.userId, member.role)} 
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                                    title={t.common_remove || (language === 'ar' ? 'إزالة' : 'Remove')}
                                  >
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                      <button 
                        onClick={() => props.setShowRolesModal(false)} 
                        className="px-6 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition text-sm"
                      >
                        {t.common_close || (language === 'ar' ? 'إغلاق' : 'Close')}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Confirm Delete Modal */}
      {props.confirmModal.isOpen && (
          <div className="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn border border-gray-100 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          <Trash2 className="w-5 h-5 text-red-500" />
                          {t.pages_delete_page || (language === 'ar' ? 'حذف الصفحة' : 'Delete Page')}
                      </h3>
                      <button onClick={props.closeConfirmModal} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400 rounded-full p-1 transition">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="p-6 text-center">
                      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertTriangle className="w-8 h-8 text-red-600" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium mb-2 leading-relaxed">
                          {t.pages_delete_confirm_desc || (language === 'ar' ? 'هل أنت متأكد من حذف الصفحة نهائياً؟' : 'Are you sure you want to delete this page?')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                          "{props.confirmModal.pageName}"
                      </p>
                  </div>
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                      <button 
                        onClick={props.closeConfirmModal} 
                        className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition text-sm"
                      >
                        {t.common_cancel || (language === 'ar' ? 'إلغاء' : 'Cancel')}
                      </button>
                      <button 
                        onClick={props.executeDeletePage} 
                        disabled={props.isDeleting} 
                        className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-sm flex items-center gap-2 disabled:opacity-70 text-sm active:scale-95"
                      >
                          {props.isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                          {t.common_delete || (language === 'ar' ? 'تأكيد الحذف' : 'Delete')}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

export default PageModals;