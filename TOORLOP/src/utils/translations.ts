export type Language = 'ar' | 'en';

export interface TranslationSchema {
  dir: 'rtl' | 'ltr';
  common: {
    loading: string;
    online: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    close: string;
    done: string;
    view_more: string;
    view_less: string;
    view_all: string;
    search: string;
    send: string;
    copy: string;
    share: string;
    download: string;
    report: string;
    confirm: string;
    back: string;
    next: string;
    prev: string;
    yes: string;
    no: string;
    success: string;
    error: string;
    copied: string;
    remove: string;
    unknown: string;
    create: string;
    update: string;
    filter: string;
    reset: string;
    all: string;
    more: string;
    less: string;
    likes: string;
    comments: string;
    views: string;
    followers: string;
    members: string;
    date: string;
    time: string;
    location: string;
    description: string;
    category: string;
    notifications: string;
    mute: string;
    unmute: string;
    pin: string;
    unpin: string;
    join: string;
    leave: string;
    joined: string;
    visit: string;
    invite: string;
    admin: string;
    moderator: string;
    member: string;
    owner: string;
    public: string;
    private: string;
    general: string;
    appearance: string;
    rules: string;
    mark_read: string;
    new_message: string;
    no_results: string;
  };
  auth: {
    login_title: string;
    signup_title: string;
    email_label: string;
    password_label: string;
    confirm_password_label: string;
    name_label: string;
    login_btn: string;
    signup_btn: string;
    forgot_password: string;
    remember_me: string;
    or_continue: string;
    have_account: string;
    no_account: string;
    reset_pass_title: string;
    reset_pass_desc: string;
    send_reset_link: string;
    back_login: string;
    secure_badge: string;
    login_desc: string;
    signup_desc: string;
  };
  nav: {
    home: string;
    friends: string;
    watch: string;
    market: string;
    gaming: string;
    groups: string;
    pages: string;
    events: string;
    memories: string;
    saved: string;
    search_placeholder: string;
    profile: string;
    settings: string;
    logout: string;
    dark_mode: string;
    light_mode: string;
    language: string;
    notifications: string;
    messages: string;
    friend_requests: string;
    view_all: string;
    mark_read: string;
    new_message: string;
    active_now: string;
    offline: string;
  };
  sidebar: {
    shortcuts: string;
    privacy_footer: string;
    add_shortcut: string;
    no_shortcuts: string;
  };
  post: {
    create_placeholder: string;
    live_video: string;
    photo_video: string;
    feeling_activity: string;
    magic_ai: string;
    publish: string;
    ai_thinking: string;
    pinned: string;
    like: string;
    comment: string;
    write_comment: string;
    reply: string;
    view_comments: string;
    delete_confirm_title: string;
    delete_confirm_desc: string;
    save_post: string;
    unsave_post: string;
    copy_link: string;
    turn_off_notif: string;
    turn_on_notif: string;
    edit_post: string;
    feeling_label: string;
    activity_label: string;
    with: string;
    at: string;
    tag_button: string;
    location_button: string;
    audience: string;
    delete: string;
    report: string;
    save: string;
    unsave: string;
    likes_count: string;
    comments_count: string;
    shares_count: string;
  };
  profile: {
    posts: string;
    about: string;
    friends: string;
    photos: string;
    videos: string;
    groups: string;
    events: string;
    more: string;
    message: string;
    add_friend: string;
    request_sent: string;
    is_friend: string;
    edit_profile: string;
    edit_cover: string;
    edit_details: string;
    add_story: string;
    view_story: string;
    view_avatar: string;
    change_name: string;
    unfriend: string;
    block: string;
    mutual_friends: string;
    friend_count: string;
    no_posts: string;
    no_posts_desc: string;
    no_photos: string;
    no_videos: string;
    no_friends: string;
    pages: string;
    joined_date: string;
  };
  profile_intro: {
    edit_hobbies: string;
    add_hobbies: string;
    edit_featured: string;
    add_featured: string;
    joined_in: string;
    joined_recent: string;
    no_hobbies: string;
    no_featured: string;
    hobbies_modal_title: string;
    hobbies_search: string;
    hobbies_suggested: string;
    featured_info: string;
    upload_error: string;
  };
  profile_friends: {
    tab_all: string;
    tab_suggestions: string;
    tab_mutual: string;
    tab_work: string;
    tab_university: string;
    tab_city: string;
    search_placeholder: string;
    privacy_title: string;
    privacy_desc: string;
    visit_profile: string;
    unfriend_confirm: string;
    block_confirm: string;
    no_results: string;
    no_suggestions: string;
    friend_requests: string;
    people_you_may_know: string;
    confirm: string;
    delete_request: string;
  };
  profile_about: {
    overview: string;
    work_edu: string;
    places: string;
    contact_basic: string;
    family_rel: string;
    details: string;
    life_events: string;
    works_at: string;
    role_at: string;
    studied: string;
    at: string;
    class_of: string;
    went_to: string;
    lives_in: string;
    from: string;
    mobile: string;
    email: string;
    website: string;
    gender: string;
    birth_date: string;
    languages: string;
    pronounce: string;
    quotes: string;
    blood_donation: string;
    other_names: string;
    no_details: string;
    add_work: string;
    add_edu: string;
    add_place: string;
    add_mobile: string;
    add_bio: string;
    ph_position: string;
    ph_company: string;
    ph_school: string;
    ph_city: string;
    ph_desc_self: string;
    ph_quote: string;
    ph_pronounce: string;
    basic_info: string;
    degree: string;
    major: string;
    platform: string;
    username_url: string;
    name_type: string;
    name_label: string;
    relationship_status: string;
    partner: string;
    family_member: string;
    family_members: string;
    relation: string;
    event_name: string;
    event_location: string;
    event_desc: string;
    empty_work: string;
    empty_uni: string;
    empty_school: string;
    empty_current_city: string;
    empty_hometown: string;
    empty_rel: string;
    empty_family: string;
    empty_mobile: string;
    no_mobile: string;
    empty_email: string;
    no_email: string;
    contact_mobile: string;
    contact_email: string;
    contact_website: string;
    empty_website: string;
    empty_social: string;
    basic_gender: string;
    empty_gender: string;
    basic_birth: string;
    empty_birth: string;
    basic_lang: string;
    empty_lang: string;
    no_lang: string;
    details_pronounce: string;
    empty_pronounce: string;
    details_quotes: string;
    details_blood: string;
    empty_quotes: string;
    empty_other_name: string;
    empty_events: string;
    about_overview: string;
    about_work_edu: string;
    about_places: string;
    about_contact: string;
    about_family: string;
    about_details: string;
    about_events: string;
    btn_edit: string;
    btn_delete: string;
    btn_cancel: string;
    btn_save: string;
    btn_view_more: string;
  };
  profile_photos: {
    your_photos: string;
    tagged_photos: string;
    albums: string;
    create_album: string;
    add_photo: string;
    empty_album: string;
    album_name: string;
    upload_hint: string;
    profile_pictures: string;
    cover_photos: string;
  };
  profile_videos: {
    videos: string;
    reels: string;
    add_video: string;
    no_videos: string;
    no_reels: string;
  };
  market: {
    title: string;
    search_placeholder: string;
    create_listing: string;
    categories: string;
    filters: string;
    price: string;
    location: string;
    condition: string;
    description: string;
    seller_info: string;
    message_seller: string;
    safety_tips: string;
    saved_items: string;
    browse: string;
    no_results: string;
    free: string;
    sold: string;
    sort_by: string;
    newest: string;
    price_low: string;
    price_high: string;
    min_price: string;
    max_price: string;
    location_radius: string;
    change_location: string;
    today_picks: string;
    saved_products: string;
    new: string;
    used_good: string;
    used_fair: string;
    product_link: string;
    photos: string;
    title_label: string;
    country: string;
    city: string;
    currency: string;
    publish_listing: string;
    preview: string;
    add_photos: string;
    photo_limit_hint: string;
    tips_1: string;
    tips_2: string;
    tips_3: string;
    verified_phone: string;
    joined_since: string;
    ask_seller: string;
    delete_product: string;
    delete_confirm_title: string;
    delete_confirm_desc: string;
    cats: {
      vehicles: string;
      electronics: string;
      computers: string;
      property: string;
      furniture: string;
      apparel: string;
      baby: string;
      sports: string;
      entertainment: string;
      hobbies: string;
      books: string;
      pets: string;
      services: string;
      tools: string;
      art: string;
      bikes: string;
      accessories: string;
      appliances: string; 
   }
  };
   gaming: {
    title: string;
    home: string;
    instant_games: string;
    live_stream: string;
    saved_games: string;
    categories: string;
    play_now: string;
    follow: string;
    unfollow: string;
    viewers: string;
    live_now: string;
    suggested: string;
    search_placeholder: string;
    back_to_menu: string;
    cats: {
      action: string;
      shooter: string;
      adventure: string;
      strategy: string;
      sports: string;
      racing: string;
      puzzle: string;
      arcade: string;
      horror: string;
      simulation: string;
      board: string;
    };
    hero_title: string;
    hero_desc: string;
    watch_stream: string;
    stream_by: string;
    chat_welcome: string;
    send_message: string;
    share_game: string;
    share_stream: string;
    game_ready: string;
    loading_game: string;
    score: string;
    game_over: string;
    play_again: string;
    moves: string;
    congrats: string;
    you_won: string;
    computer_won: string;
    draw: string;
    your_choice: string;
    computer_choice: string;
    rock: string;
    paper: string;
    scissors: string;
    math_challenge: string;
    math_desc: string;
    snake_paused: string;
    snake_playing: string;
    snake_controls: string;
    rps_title: string;
  };
  date_now: string;
  write_comment: string;
  friend_count: string;
  
  groups: {
    title: string;
    create_group: string;
    join: string;
    leave: string;
    joined: string;
    members: string;
    about: string;
    discussion: string;
    files: string;
    admin_tools: string;
    pending_requests: string;
    rules: string;
    invite: string;
    private_group: string;
    public_group: string;
    member_count: string;
    discover: string;
    managed_groups: string;
    joined_groups: string;
    search_placeholder: string;
    create_modal_title: string;
    group_name: string;
    privacy_hint: string;
    edit_group: string;
    general: string;
    appearance: string;
    cover_photo: string;
    change_cover: string;
    group_color: string;
    add_rule: string;
    no_rules: string;
    manage_members: string;
    add_member: string;
    search_member: string;
    role: string;
    remove_member: string;
    events: string;
    media: string;
    photos: string;
    videos: string;
    files_tab: string;
    upload_file: string;
    create_event: string;
    event_title: string;
    event_date: string;
    event_time: string;
    event_location: string;
    event_desc: string;
    going: string;
    interested: string;
    admin_dashboard: string;
    overview: string;
    reports: string;
    activity_log: string;
    total_members: string;
    posts_this_month: string;
    pending_count: string;
    quick_settings: string;
    post_approval: string;
    post_approval_hint: string;
    admin_notifs: string;
    admin_notifs_hint: string;
    approve: string;
    reject: string;
    keep_content: string;
    delete_content: string;
    report_reason: string;
    pinned_group: string;
    pin_group: string;
    unpin_group: string;
    copy_link: string;
    leave_confirm_title: string;
    leave_confirm_desc: string;
    delete_confirm_title: string;
    delete_confirm_desc: string;
    delete_post_confirm_title: string;
    delete_post_confirm_desc: string;
    no_posts: string;
    be_first: string;
  };
  pages: {
    title: string;
    create_page: string;
    liked_pages: string;
    my_pages: string;
    discover: string;
    search_placeholder: string;
    like: string;
    liked: string;
    follow: string;
    followed: string;
    message: string;
    contact: string;
    website: string;
    email: string;
    phone: string;
    category: string;
    followers: string;
    likes_count: string;
    posts: string;
    about: string;
    photos: string;
    videos: string;
    community: string;
    edit_page: string;
    manage_roles: string;
    delete_page: string;
    create_modal_title: string;
    page_name: string;
    page_category: string;
    page_desc: string;
    delete_confirm_title: string;
    delete_confirm_desc: string;
    no_pages: string;
    invite_friends: string;
    admin_roles: string;
    assign_role: string;
  };
  memories: {
    title: string;
    on_this_day: string;
    recent: string;
    settings: string;
    notification_pref: string;
    hidden_people: string;
    hidden_dates: string;
    people_hide_title: string;
    dates_hide_title: string;
    search_people: string;
    select_date: string;
    add_date: string;
    save_changes: string;
    share_memory: string;
    no_memories: string;
    notify_me: string;
    years_ago: string;
    year_ago: string;
  };
  privacy: {
    public: string;
    friends: string;
    friends_except: string;
    only_me: string;
    custom: string;
  };
  placeholders: {
    select_option: string;
    type_message: string;
    search: string;
  };
  errors: {
    required: string;
    invalid_email: string;
    password_short: string;
    password_mismatch: string;
    file_too_large: string;
    unsupported_file: string;
    generic: string;
  };
  countries: Record<string, string>;
  relationship_statuses: Record<string, string>;
  family_relations: Record<string, string>;
  name_types: Record<string, string>;
  feelings: Record<string, string>;
  activities: Record<string, string>;
  hobbies: Record<string, string>;
  job_titles: Record<string, string>;
  degrees: Record<string, string>;
  languages_list: Record<string, string>;
  months: Record<string, string>;
  chat_themes: Record<string, string>;
  emoji_categories: Record<string, string>;
  reactions: Record<string, string>;
  report_reasons: Record<string, string>;
  cities: Record<string, string>;
  group_rules: Record<string, string>;
}

export const translations: Record<Language, TranslationSchema> = {
  ar: {
    dir: 'rtl',
    common: {
      loading: 'جاري التحميل...',
      online: 'نشط الآن',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة',
      close: 'إغلاق',
      done: 'تم',
      view_more: 'عرض المزيد',
      view_less: 'عرض أقل',
      view_all: 'عرض الكل',
      search: 'بحث',
      send: 'إرسال',
      copy: 'نسخ',
      share: 'مشاركة',
      download: 'تنزيل',
      report: 'إبلاغ',
      confirm: 'تأكيد',
      back: 'عودة',
      next: 'التالي',
      prev: 'السابق',
      yes: 'نعم',
      no: 'لا',
      success: 'نجاح',
      error: 'خطأ',
      copied: 'تم النسخ',
      remove: 'إزالة',
      unknown: 'غير معروف',
      create: 'إنشاء',
      update: 'تحديث',
      filter: 'تصفية',
      reset: 'إعادة تعيين',
      all: 'الكل',
      more: 'المزيد',
      less: 'أقل',
      likes: 'إعجابات',
      comments: 'تعليقات',
      views: 'مشاهدات',
      followers: 'متابعون',
      members: 'أعضاء',
      date: 'التاريخ',
      time: 'الوقت',
      location: 'الموقع',
      description: 'الوصف',
      category: 'الفئة',
      notifications: 'الإشعارات',
      mute: 'كتم',
      unmute: 'إلغاء الكتم',
      pin: 'تثبيت',
      unpin: 'إلغاء التثبيت',
      join: 'انضمام',
      leave: 'مغادرة',
      joined: 'منضم',
      visit: 'زيارة',
      invite: 'دعوة',
      admin: 'مسؤول',
      moderator: 'مشرف',
      member: 'عضو',
      owner: 'المالك',
      public: 'عام',
      private: 'خاص',
      general: 'عام',
      appearance: 'المظهر',
      rules: 'القواعد',
      mark_read: 'تحديد الكل كمقروء',
      new_message: 'رسالة جديدة',
      no_results: 'لا توجد نتائج',
    },
    auth: {
      login_title: 'تسجيل الدخول',
      signup_title: 'إنشاء حساب جديد',
      email_label: 'البريد الإلكتروني',
      password_label: 'كلمة المرور',
      confirm_password_label: 'تأكيد كلمة المرور',
      name_label: 'الاسم الكامل',
      login_btn: 'تسجيل الدخول',
      signup_btn: 'إنشاء حساب',
      forgot_password: 'نسيت كلمة المرور؟',
      remember_me: 'تذكرني',
      or_continue: 'أو المتابعة عبر',
      have_account: 'لديك حساب بالفعل؟',
      no_account: 'ليس لديك حساب؟',
      reset_pass_title: 'استعادة كلمة المرور',
      reset_pass_desc: 'أدخل بريدك الإلكتروني لإرسال تعليمات إعادة التعيين',
      send_reset_link: 'إرسال رابط الاستعادة',
      back_login: 'العودة لتسجيل الدخول',
      secure_badge: 'محمي بواسطة Tourloop Secure',
      login_desc: 'يرجى إدخال بياناتك لتسجيل الدخول',
      signup_desc: 'املأ البيانات التالية للانضمام إلينا'
    },
    nav: {
      home: 'الرئيسية',
      friends: 'الأصدقاء',
      watch: 'فيديو',
      market: 'المتجر',
      gaming: 'ألعاب',
      groups: 'المجموعات',
      pages: 'الصفحات',
      events: 'المناسبات',
      memories: 'الذكريات',
      saved: 'العناصر المحفوظة',
      search_placeholder: 'بحث في Tourloop',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات والخصوصية',
      logout: 'تسجيل الخروج',
      dark_mode: 'الوضع الليلي',
      light_mode: 'الوضع النهاري',
      language: 'اللغة',
      notifications: 'الإشعارات',
      messages: 'الرسائل',
      friend_requests: 'طلبات الصداقة',
      view_all: 'عرض الكل',
      mark_read: 'تحديد الكل كمقروء',
      new_message: 'رسالة جديدة',
      active_now: 'نشط الآن',
      offline: 'غير متصل',
    },
    sidebar: {
      shortcuts: 'اختصاراتك',
      privacy_footer: 'الخصوصية · الشروط · الإعلانات · Meta © 2024',
      add_shortcut: 'إضافة اختصار',
      no_shortcuts: 'لا توجد اختصارات'
    },
    post: {
      create_placeholder: 'بم تفكر يا',
      live_video: 'فيديو مباشر',
      photo_video: 'صورة/فيديو',
      feeling_activity: 'شعور/نشاط',
      magic_ai: 'ذكاء اصطناعي',
      publish: 'نشر',
      ai_thinking: 'جاري التفكير...',
      pinned: 'منشور مثبت',
      like: 'أعجبني',
      comment: 'تعليق',
      write_comment: 'اكتب تعليقاً...',
      reply: 'رد',
      view_comments: 'عرض التعليقات',
      delete_confirm_title: 'حذف المنشور؟',
      delete_confirm_desc: 'هل أنت متأكد من حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.',
      save_post: 'حفظ المنشور',
      unsave_post: 'إلغاء الحفظ',
      copy_link: 'نسخ الرابط',
      turn_off_notif: 'إيقاف الإشعارات',
      turn_on_notif: 'تشغيل الإشعارات',
      edit_post: 'تعديل المنشور',
      feeling_label: 'يشعر بـ',
      activity_label: 'يحتفل بـ',
      with: 'مع',
      at: 'في',
      tag_button: 'إشارة',
      location_button: 'مكان',
      audience: 'تعديل الجمهور',
      delete: 'حذف المنشور',
      report: 'إبلاغ عن المنشور',
      save: 'حفظ المنشور',
      unsave: 'إلغاء حفظ المنشور',
      likes_count: 'إعجاب',
      comments_count: 'تعليق',
      shares_count: 'مشاركة',
    },
    profile: {
      posts: 'المنشورات',
      about: 'حول',
      friends: 'الأصدقاء',
      photos: 'الصور',
      videos: 'الفيديو',
      groups: 'المجموعات',
      events: 'المناسبات',
      more: 'المزيد',
      message: 'مراسلة',
      add_friend: 'إضافة صديق',
      request_sent: 'تم الإرسال',
      is_friend: 'أصدقاء',
      edit_profile: 'تعديل الملف الشخصي',
      edit_cover: 'تعديل الغلاف',
      edit_details: 'تعديل التفاصيل',
      add_story: 'إضافة للقصة',
      view_story: 'عرض القصة',
      view_avatar: 'عرض الصورة الشخصية',
      change_name: 'تغيير الاسم',
      unfriend: 'إلغاء الصداقة',
      block: 'حظر',
      mutual_friends: 'صديق مشترك',
      friend_count: 'صديق',
      no_posts: 'لا توجد منشورات بعد',
      no_posts_desc: 'عندما يقوم هذا المستخدم بنشر تحديثات، ستظهر هنا.',
      no_photos: 'لا توجد صور لعرضها',
      no_videos: 'لا توجد مقاطع فيديو',
      no_friends: 'لا يوجد أصدقاء لعرضهم',
      pages: 'الصفحات',
      joined_date: 'انضم في',
    },
    profile_intro: {
      edit_hobbies: 'تعديل الهوايات',
      add_hobbies: 'إضافة هوايات',
      edit_featured: 'تعديل العناصر المميزة',
      add_featured: 'إضافة صور مميزة',
      joined_in: 'انضم في',
      joined_recent: 'انضم حديثاً',
      no_hobbies: 'لا توجد هوايات مضافة',
      no_featured: 'لا توجد عناصر مميزة',
      hobbies_modal_title: 'إضافة هوايات',
      hobbies_search: 'ما هي هواياتك؟',
      hobbies_suggested: 'هوايات مقترحة',
      featured_info: 'اختر صوراً تعبر عن شخصيتك لتظهر في مقدمة ملفك الشخصي.',
      upload_error: 'حدث خطأ أثناء الرفع'
    },
    profile_friends: {
      tab_all: 'الكل',
      tab_suggestions: 'اقتراحات',
      tab_mutual: 'أصدقاء مشتركون',
      tab_work: 'العمل',
      tab_university: 'الجامعة',
      tab_city: 'المدينة الحالية',
      search_placeholder: 'بحث...',
      privacy_title: 'من يمكنه رؤية قائمة أصدقائك؟',
      privacy_desc: 'تحكم في خصوصية قائمة الأصدقاء الخاصة بك.',
      visit_profile: 'زيارة الملف الشخصي',
      unfriend_confirm: 'هل أنت متأكد من إلغاء صداقة',
      block_confirm: 'هل أنت متأكد من حظر',
      no_results: 'لا توجد نتائج مطابقة',
      no_suggestions: 'لا توجد اقتراحات حالياً',
      friend_requests: 'طلبات الصداقة',
      people_you_may_know: 'أشخاص قد تعرفهم',
      confirm: 'تأكيد',
      delete_request: 'حذف'
    },
    profile_about: {
      overview: 'نظرة عامة',
      work_edu: 'العمل والتعليم',
      places: 'الأماكن التي عشت فيها',
      contact_basic: 'المعلومات الأساسية والاتصال',
      family_rel: 'العائلة والعلاقات',
      details: 'تفاصيل عنك',
      life_events: 'المناسبات الشخصية',
      works_at: 'يعمل لدى',
      role_at: 'في',
      studied: 'درس',
      at: 'في',
      class_of: 'تخرج عام',
      went_to: 'درس في',
      lives_in: 'يقيم في',
      from: 'من',
      mobile: 'هاتف محمول',
      email: 'البريد الإلكتروني',
      website: 'موقع ويب',
      gender: 'النوع',
      birth_date: 'تاريخ الميلاد',
      languages: 'اللغات',
      pronounce: 'نطق الاسم',
      quotes: 'الاقتباسات المفضلة',
      blood_donation: 'التبرع بالدم',
      other_names: 'أسماء أخرى',
      no_details: 'لا توجد تفاصيل لعرضها في النظرة العامة.',
      add_work: 'أضف مكان عمل',
      add_edu: 'إضافة كلية / جامعة',
      add_place: 'إضافة مدينة حالية',
      add_mobile: 'إضافة رقم هاتف',
      add_bio: 'اكتب نبذة عن نفسك',
      ph_position: 'المسمى الوظيفي',
      ph_company: 'اسم الشركة',
      ph_school: 'اسم المدرسة',
      ph_city: 'المدينة',
      ph_desc_self: 'صف نفسك...',
      ph_quote: 'أضف اقتباسك المفضل...',
      ph_pronounce: 'كيف ينطق اسمك؟',
      basic_info: 'المعلومات الأساسية',
      degree: 'الدرجة العلمية',
      major: 'التخصص',
      platform: 'المنصة',
      username_url: 'رابط الحساب / اسم المستخدم',
      name_type: 'نوع الاسم',
      name_label: 'الاسم',
      relationship_status: 'الحالة الاجتماعية',
      partner: 'الشريك',
      family_member: 'فرد العائلة',
      family_members: 'أفراد العائلة',
      relation: 'صلة القرابة',
      event_name: 'اسم المناسبة',
      event_location: 'عنوان المناسبة',
      event_desc: 'وصف المناسبة',
      empty_work: 'إضافة مكان عمل',
      empty_uni: 'إضافة جامعة',
      empty_school: 'إضافة مدرسة ثانوية',
      empty_current_city: 'إضافة مدينة حالية',
      empty_hometown: 'إضافة مسقط رأس',
      empty_rel: 'إضافة حالة اجتماعية',
      empty_family: 'إضافة فرد عائلة',
      empty_mobile: 'إضافة رقم هاتف',
      no_mobile: 'لا يوجد رقم هاتف',
      empty_email: 'إضافة بريد إلكتروني',
      no_email: 'لا يوجد بريد إلكتروني',
      contact_mobile: 'هاتف',
      contact_email: 'بريد إلكتروني',
      contact_website: 'موقع ويب',
      empty_website: 'إضافة موقع ويب',
      empty_social: 'إضافة رابط اجتماعي',
      basic_gender: 'النوع',
      empty_gender: 'إضافة النوع',
      basic_birth: 'تاريخ الميلاد',
      empty_birth: 'إضافة تاريخ ميلاد',
      basic_lang: 'اللغات',
      empty_lang: 'إضافة لغة',
      no_lang: 'لا توجد لغات',
      details_pronounce: 'نطق الاسم',
      empty_pronounce: 'إضافة نطق الاسم',
      details_quotes: 'اقتباسات مفضلة',
      details_blood: 'التبرع بالدم',
      empty_quotes: 'إضافة اقتباس مفضل',
      empty_other_name: 'إضافة اسم آخر',
      empty_events: 'إضافة مناسبة',
      about_overview: 'نظرة عامة',
      about_work_edu: 'العمل والتعليم',
      about_places: 'الأماكن',
      about_contact: 'معلومات الاتصال',
      about_family: 'العائلة والعلاقات',
      about_details: 'تفاصيل عنك',
      about_events: 'المناسبات',
      btn_edit: 'تعديل',
      btn_delete: 'حذف',
      btn_cancel: 'إلغاء',
      btn_save: 'حفظ',
      btn_view_more: 'عرض المزيد'
    },
    profile_photos: {
      your_photos: 'الصور الخاصة بك',
      tagged_photos: 'صور تمت الإشارة إليك فيها',
      albums: 'الألبومات',
      create_album: 'إنشاء ألبوم',
      add_photo: 'إضافة صورة',
      empty_album: 'هذا الألبوم فارغ',
      album_name: 'اسم الألبوم',
      upload_hint: 'اضغط لإضافة صور من جهازك',
      profile_pictures: 'صور الملف الشخصي',
      cover_photos: 'صور الغلاف'      
    },
    profile_videos: {
      videos: 'مقاطع الفيديو',
      reels: 'ريلز (Reels)',
      add_video: 'إضافة فيديو',
      no_videos: 'لا توجد مقاطع فيديو',
      no_reels: 'لا توجد مقاطع ريلز'
    },
    market: {
      title: 'المتجر',
      search_placeholder: 'بحث في المتجر...',
      create_listing: 'إنشاء قائمة جديدة',
      categories: 'الفئات',
      filters: 'الفلاتر',
      price: 'السعر',
      location: 'الموقع',
      condition: 'الحالة',
      description: 'الوصف',
      seller_info: 'معلومات البائع',
      message_seller: 'مراسلة البائع',
      safety_tips: 'نصائح السلامة',
      saved_items: 'العناصر المحفوظة',
      browse: 'تصفح',
      no_results: 'لا توجد منتجات مطابقة',
      free: 'مجاني',
      sold: 'تم البيع',
      sort_by: 'الترتيب حسب',
      newest: 'الأحدث',
      price_low: 'السعر: الأقل أولاً',
      price_high: 'السعر: الأعلى أولاً',
      min_price: 'من',
      max_price: 'إلى',
      location_radius: 'ضمن 60 كم',
      change_location: 'تغيير',
      today_picks: 'اختيارات اليوم',
      saved_products: 'المنتجات المحفوظة',
      new: 'جديد',
      used_good: 'مستعمل - بحالة جيدة',
      used_fair: 'مستعمل - بحالة مقبولة',
      product_link: 'رابط المنتج',
      photos: 'الصور',
      title_label: 'العنوان',
      country: 'الدولة',
      city: 'المدينة',
      currency: 'العملة',
      publish_listing: 'نشر القائمة',
      preview: 'معاينة القائمة',
      add_photos: 'أضف صورة للمعاينة',
      photo_limit_hint: 'حتى 8 صور',
      tips_1: 'لا ترسل أموالاً قبل استلام المنتج.',
      tips_2: 'تحقق من المنتج جيداً قبل الشراء.',
      tips_3: 'قابل البائع في مكان عام وآمن.',
      verified_phone: 'تم التحقق من الهاتف',
      joined_since: 'انضم منذ',
      ask_seller: 'اسأل البائع سؤالاً...',
      delete_product: 'حذف المنتج',
      delete_confirm_title: 'حذف المنتج؟',
      delete_confirm_desc: 'هل أنت متأكد من حذف هذا المنتج نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      cats: {
        vehicles: 'مركبات وقطع غيار',
        electronics: 'إلكترونيات وجوالات',
        computers: 'كمبيوتر ولابتوب',
        property: 'عقارات للبيع والإيجار',
        furniture: 'أثاث وديكور منزلي',
        apparel: 'ملابس وأزياء',
        baby: 'مستلزمات أطفال',
        sports: 'رياضة ولياقة',
        entertainment: 'ألعاب فيديو وكونسول',
        hobbies: 'آلات موسيقية وهوايات',
        books: 'كتب ومجلات',
        pets: 'حيوانات أليفة',
        services: 'خدمات ووظائف',
        tools: 'عدد وأدوات صناعية',
        art: 'فنون وتحف',
        bikes: 'دراجات ومعدات',
        accessories: 'ساعات ومجوهرات',
        appliances: 'أجهزة منزلية'     
       }
    },
     gaming: {
      title: 'الألعاب',
      home: 'الرئيسية',
      instant_games: 'ألعاب فورية',
      live_stream: 'بث مباشر',
      saved_games: 'ألعاب محفوظة',
      categories: 'الفئات',
      play_now: 'لعب الآن',
      follow: 'متابعة',
      unfollow: 'إلغاء المتابعة',
      viewers: 'مشاهد',
      live_now: 'مباشر الآن',
      suggested: 'مقترح لك',
      search_placeholder: 'بحث عن ألعاب وبثوث...',
      back_to_menu: 'العودة للقائمة الرئيسية',
      cats: {
        action: 'أكشن',
        shooter: 'إطلاق نار',
        adventure: 'مغامرات',
        strategy: 'استراتيجية',
        sports: 'رياضة',
        racing: 'سباق',
        puzzle: 'ألغاز',
        arcade: 'أركيد',
        horror: 'رعب',
        simulation: 'محاكاة',
        board: 'بورد'
      },
      hero_title: 'نهائيات البطولة الكبرى',
      hero_desc: 'شاهد أفضل اللاعبين يتنافسون على اللقب في معركة ملحمية لا تفوت!',
      watch_stream: 'مشاهدة البث',
      stream_by: 'بث مباشر بواسطة',
      chat_welcome: 'مرحباً بك في المحادثة!',
      send_message: 'إرسال رسالة...',
      share_game: 'مشاركة هذه اللعبة',
      share_stream: 'مشاركة هذا البث',
      game_ready: 'اللعبة جاهزة!',
      loading_game: 'جاري تحميل اللعبة...',
      score: 'النتيجة',
      game_over: 'انتهت اللعبة',
      play_again: 'لعب مرة أخرى',
      moves: 'الحركات',
      congrats: 'مبروك!',
      you_won: 'أنت فزت!',
      computer_won: 'الكمبيوتر فاز!',
      draw: 'تعادل!',
      your_choice: 'اختيارك',
      computer_choice: 'الكمبيوتر',
      rock: 'حجرة',
      paper: 'ورقة',
      scissors: 'مقص',
      math_challenge: 'تحدي الرياضيات',
      math_desc: 'حل أكبر عدد ممكن من المسائل في 30 ثانية!',
      snake_paused: 'موقوف',
      snake_playing: 'جاري اللعب',
      snake_controls: 'استخدم الأسهم للتحكم في الثعبان',
      rps_title: 'حجرة ورقة مقص',
    },
    date_now: 'الآن',
    write_comment: 'اكتب تعليقاً...',
    friend_count: 'صديق',
  
    groups: {
      title: 'المجموعات',
      create_group: 'إنشاء مجموعة',
      join: 'انضمام',
      leave: 'مغادرة',
      joined: 'تم الانضمام',
      members: 'الأعضاء',
      about: 'حول',
      discussion: 'المناقشة',
      files: 'الملفات',
      admin_tools: 'أدوات المسؤول',
      pending_requests: 'طلبات العضوية',
      rules: 'القواعد',
      invite: 'دعوة',
      private_group: 'مجموعة خاصة',
      public_group: 'مجموعة عامة',
      member_count: 'عضو',
      discover: 'اكتشف',
      managed_groups: 'مجموعات تديرها',
      joined_groups: 'مجموعات انضممت إليها',
      search_placeholder: 'بحث في المجموعات...',
      create_modal_title: 'إنشاء مجموعة جديدة',
      group_name: 'اسم المجموعة',
      privacy_hint: 'يمكن لأي شخص رؤية أعضاء المجموعة وما ينشرونه.',
      edit_group: 'تعديل المجموعة',
      general: 'عام',
      appearance: 'المظهر',
      cover_photo: 'صورة الغلاف',
      change_cover: 'تغيير صورة الغلاف',
      group_color: 'لون المجموعة',
      add_rule: 'أضف قاعدة جديدة...',
      no_rules: 'لم تتم إضافة أي قواعد بعد.',
      manage_members: 'إدارة الأعضاء',
      add_member: 'إضافة عضو جديد',
      search_member: 'اسم العضو...',
      role: 'الدور',
      remove_member: 'إزالة العضو',
      events: 'المناسبات',
      media: 'الوسائط',
      photos: 'الصور',
      videos: 'مقاطع الفيديو',
      files_tab: 'ملفات المجموعة',
      upload_file: 'رفع ملف',
      create_event: 'إنشاء مناسبة',
      event_title: 'اسم المناسبة',
      event_date: 'التاريخ',
      event_time: 'الوقت',
      event_location: 'الموقع',
      event_desc: 'وصف المناسبة',
      going: 'ذاهب',
      interested: 'مهتم',
      admin_dashboard: 'لوحة التحكم',
      overview: 'نظرة عامة',
      reports: 'الإبلاغات',
      activity_log: 'سجل النشاطات',
      total_members: 'إجمالي الأعضاء',
      posts_this_month: 'منشورات هذا الشهر',
      pending_count: 'طلبات معلقة',
      quick_settings: 'إعدادات سريعة',
      post_approval: 'الموافقة على المنشورات',
      post_approval_hint: 'يجب موافقة المسؤول قبل ظهور المنشور',
      admin_notifs: 'إشعارات المسؤولين',
      admin_notifs_hint: 'تلقي إشعارات عند حدوث نشاط مهم',
      approve: 'موافقة',
      reject: 'رفض',
      keep_content: 'تجاهل (إبقاء المحتوى)',
      delete_content: 'حذف المحتوى المخالف',
      report_reason: 'يرجى تحديد سبب الإبلاغ',
      pinned_group: 'مجموعة مثبتة',
      pin_group: 'تثبيت المجموعة',
      unpin_group: 'إلغاء تثبيت المجموعة',
      copy_link: 'نسخ رابط المجموعة',
      leave_confirm_title: 'مغادرة المجموعة؟',
      leave_confirm_desc: 'هل أنت متأكد من مغادرة هذه المجموعة؟ لن تتمكن من رؤية المنشورات الخاصة.',
      delete_confirm_title: 'حذف المجموعة؟',
      delete_confirm_desc: 'هل أنت متأكد من حذف المجموعة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      delete_post_confirm_title: 'حذف المنشور؟',
      delete_post_confirm_desc: 'هل أنت متأكد من حذف هذا المنشور نهائياً من المجموعة؟',
      no_posts: 'لا توجد منشورات',
      be_first: 'ابدأ النقاش وكن أول من ينشر!'
    },
    pages: {
      title: 'الصفحات',
      create_page: 'إنشاء صفحة',
      liked_pages: 'صفحات أعجبتني',
      my_pages: 'صفحاتي',
      discover: 'اكتشف',
      search_placeholder: 'بحث في الصفحات...',
      like: 'إعجاب',
      liked: 'أعجبني',
      follow: 'متابعة',
      followed: 'متابع',
      message: 'مراسلة',
      contact: 'معلومات الاتصال',
      website: 'موقع ويب',
      email: 'بريد إلكتروني',
      phone: 'هاتف',
      category: 'الفئة',
      followers: 'متابع',
      likes_count: 'إعجاب',
      posts: 'المنشورات',
      about: 'حول',
      photos: 'الصور',
      videos: 'الفيديو',
      community: 'المجتمع',
      edit_page: 'تعديل الصفحة',
      manage_roles: 'إدارة الأدوار',
      delete_page: 'حذف الصفحة',
      create_modal_title: 'إنشاء صفحة جديدة',
      page_name: 'اسم الصفحة',
      page_category: 'فئة الصفحة',
      page_desc: 'وصف الصفحة',
      delete_confirm_title: 'حذف الصفحة؟',
      delete_confirm_desc: 'هل أنت متأكد من حذف الصفحة نهائياً؟',
      no_pages: 'لا توجد صفحات',
      invite_friends: 'دعوة الأصدقاء',
      admin_roles: 'المسؤولون والمشرفون',
      assign_role: 'تعيين دور جديد'
    },
    memories: {
      title: 'ذكرياتك',
      on_this_day: 'في مثل هذا اليوم',
      recent: 'ذكريات حديثة',
      settings: 'الإعدادات',
      notification_pref: 'تفضيلات الإشعارات',
      hidden_people: 'أشخاص مخفيون',
      hidden_dates: 'تواريخ مخفية',
      people_hide_title: 'أشخاص لا أريد رؤيتهم',
      dates_hide_title: 'تواريخ لا أريد رؤيتها',
      search_people: 'ابحث عن شخص لإخفائه...',
      select_date: 'تحديد تاريخ',
      add_date: 'إضافة التاريخ',
      save_changes: 'حفظ التغييرات',
      share_memory: 'مشاركة الذكرى',
      no_memories: 'لا توجد ذكريات لعرضها اليوم',
      notify_me: 'إشعاري عند توفر ذكريات',
      years_ago: 'منذ سنوات',
      year_ago: 'منذ عام'
    },
    privacy: {
      public: 'عامة',
      friends: 'الأصدقاء',
      friends_except: 'الأصدقاء باستثناء...',
      only_me: 'أنا فقط',
      custom: 'مخصص'
    },
    placeholders: {
      select_option: 'اختر...',
      type_message: 'اكتب رسالة...',
      search: 'بحث...'
    },
    errors: {
      required: 'هذا الحقل مطلوب',
      invalid_email: 'البريد الإلكتروني غير صحيح',
      password_short: 'كلمة المرور قصيرة جداً',
      password_mismatch: 'كلمات المرور غير متطابقة',
      file_too_large: 'حجم الملف كبير جداً',
      unsupported_file: 'نوع الملف غير مدعوم',
      generic: 'حدث خطأ ما، يرجى المحاولة مرة أخرى'
    },
    countries: {
      'مصر': 'Egypt',
      'السعودية': 'Saudi Arabia',
      'الإمارات': 'UAE',
      'الكويت': 'Kuwait',
      'قطر': 'Qatar',
      'البحرين': 'Bahrain',
      'عمان': 'Oman',
      'الأردن': 'Jordan',
      'لبنان': 'Lebanon',
      'العراق': 'Iraq',
      'سوريا': 'Syria',
      'فلسطين': 'Palestine',
      'المغرب': 'Morocco',
      'تونس': 'Tunisia',
      'الجزائر': 'Algeria',
      'ليبيا': 'Libya',
      'السودان': 'Sudan',
      'اليمن': 'Yemen',
      'موريتانيا': 'Mauritania',
      'الصومال': 'Somalia',
      'جيبوتي': 'Djibouti',
      'جزر القمر': 'Comoros',
      'تركيا': 'Turkey',
      'الولايات المتحدة': 'United States',
      'المملكة المتحدة': 'United Kingdom',
      'ألمانيا': 'Germany',
      'فرنسا': 'France',
      'إيطاليا': 'Italy',
      'إسبانيا': 'Spain',
      'كندا': 'Canada',
      'أستراليا': 'Australia',
      'الهند': 'India',
      'الصين': 'China',
      'اليابان': 'Japan',
      'البرازيل': 'Brazil',
      'روسيا': 'Russia'
    },
    relationship_statuses: {
      'أعزب': 'Single',
      'مرتبط': 'In a relationship',
      'مخطوب': 'Engaged',
      'متزوج': 'Married',
      'في علاقة مدنية': 'In a civil union',
      'في علاقة مفتوحة': 'In an open relationship',
      'علاقة معقدة': 'It\'s complicated',
      'منفصل': 'Separated',
      'مطلق': 'Divorced',
      'أرمل': 'Widowed'
    },
    family_relations: {
      'أب': 'Father',
      'أم': 'Mother',
      'أخ': 'Brother',
      'أخت': 'Sister',
      'ابن': 'Son',
      'ابنة': 'Daughter',
      'عم/خال': 'Uncle',
      'عمة/خالة': 'Aunt',
      'جد': 'Grandfather',
      'جدة': 'Grandmother',
      'ابن أخ/أخت': 'Nephew',
      'ابنة أخ/أخت': 'Niece',
      'ابن عم/خال': 'Cousin (M)',
      'ابنة عم/خال': 'Cousin (F)',
      'زوج الأب': 'Stepfather',
      'زوجة الأب': 'Stepmother'
    },
    name_types: {
      'اسم الشهرة': 'Nickname',
      'اسم قبل الزواج': 'Maiden Name',
      'طريقة كتابة بديلة': 'Alternative Spelling',
      'اسم المتزوجة': 'Married Name',
      'اسم الأب': 'Father\'s Name',
      'اسم الميلاد': 'Birth Name',
      'اسم سابق': 'Former Name',
      'اسم مع لقب': 'Name with Title',
      'آخر': 'Other'
    },
    feelings: {
      'سعيد': 'Happy',
      'محبوب': 'Loved',
      'حزين': 'Sad',
      'متحمس': 'Excited',
      'محبط': 'Frustrated',
      'شاكر': 'Thankful',
      'غاضب': 'Angry',
      'رائع': 'Cool',
      'متعب': 'Tired',
      'مفكر': 'Thinking',
      'مبارك': 'Blessed',
      'حائر': 'Confused',
      'قوي': 'Strong',
      'نعسان': 'Sleepy',
      'مريض': 'Sick',
      'مصدوم': 'Shocked',
      'واثق': 'Confident',
      'ممتن': 'Grateful',
      'فخور': 'Proud',
      'مرتاح': 'Relaxed',
      'قلق': 'Worried',
      'وحيد': 'Lonely',
      'مندهش': 'Surprised',
      'خجول': 'Shy',
      'جائع': 'Hungry',
      'مستاء': 'Annoyed',
      'متفائل': 'Optimistic',
      'مبدع': 'Creative',
      'نشيط': 'Energetic',
      'هادئ': 'Calm'
    },
    activities: {
      'يحتفل': 'Celebrating',
      'يشاهد': 'Watching',
      'يأكل': 'Eating',
      'يشرب': 'Drinking',
      'يسافر إلى': 'Traveling to',
      'يستمع إلى': 'Listening to',
      'يقرأ': 'Reading',
      'يلعب': 'Playing',
      'يفكر في': 'Thinking about',
      'يدعم': 'Supporting',
      'يبحث عن': 'Looking for',
      'يتعلم': 'Learning',
      'يعمل': 'Working',
      'يتمرن': 'Exercising',
      'يطبخ': 'Cooking',
      'يتسوق': 'Shopping',
      'يسترخي': 'Relaxing',
      'يصلي': 'Praying',
      'يرسم': 'Drawing',
      'يكتب': 'Writing',
      'يصور': 'Taking photos',
      'يبرمج': 'Coding',
      'ينام': 'Sleeping'
    },
    hobbies: {
      'كرة القدم': 'Football',
      'القراءة': 'Reading',
      'السفر': 'Travel',
      'ألعاب الفيديو': 'Gaming',
      'الموسيقى': 'Music',
      'الطبخ': 'Cooking',
      'التصوير': 'Photography',
      'البرمجة': 'Coding',
      'الرسم': 'Drawing',
      'الجيم': 'Gym',
      'السباحة': 'Swimming',
      'مشاهدة الأفلام': 'Movies',
      'الكتابة': 'Writing',
      'التسوق': 'Shopping',
      'التخييم': 'Camping',
      'صيد السمك': 'Fishing',
      'الشطرنج': 'Chess',
      'السيارات': 'Cars',
      'ركوب الدراجات': 'Cycling',
      'التأمل': 'Meditation',
      'الزراعة': 'Gardening',
      'تربية الحيوانات': 'Pets',
      'التصميم': 'Design',
      'عشاق القهوة': 'Coffee',
      'التاريخ': 'History',
      'العلوم': 'Science',
      'التقنية': 'Tech',
      'الجري': 'Running',
      'اليوغا': 'Yoga',
      'الرقص': 'Dancing',
      'الغناء': 'Singing',
      'العمل التطوعي': 'Volunteering',
      'الموضة': 'Fashion',
      'المكياج': 'Makeup',
      'الأنمي': 'Anime',
      'البلياردو': 'Billiards',
      'التنس': 'Tennis',
      'كرة السلة': 'Basketball'
    },
    job_titles: {
      'مهندس برمجيات': 'Software Engineer',
      'مطور ويب': 'Web Developer',
      'مطور تطبيقات جوال': 'Mobile App Developer',
      'مدير مشروع تقني': 'Technical Project Manager',
      'مصمم جرافيك': 'Graphic Designer',
      'مصمم واجهات مستخدم (UI/UX)': 'UI/UX Designer',
      'محلل بيانات': 'Data Analyst',
      'مهندس أمن سيبراني': 'Cyber Security Engineer',
      'مسؤول شبكات': 'Network Administrator',
      'محاسب': 'Accountant',
      'مدير موارد بشرية': 'HR Manager',
      'مسوق إلكتروني': 'Digital Marketer',
      'مدير مبيعات': 'Sales Manager',
      'مندوب مبيعات': 'Sales Representative',
      'خدمة عملاء': 'Customer Service',
      'سكرتير': 'Secretary',
      'موظف استقبال': 'Receptionist',
      'مدير عام': 'General Manager',
      'رائد أعمال': 'Entrepreneur',
      'محلل مالي': 'Financial Analyst',
      'طبيب بشري': 'Physician',
      'طبيب أسنان': 'Dentist',
      'صيدلي': 'Pharmacist',
      'ممرض': 'Nurse',
      'أخصائي علاج طبيعي': 'Physical Therapist',
      'أخصائي تغذية': 'Nutritionist',
      'فني مختبر': 'Lab Technician',
      'طبيب بيطري': 'Veterinarian',
      'مهندس مدني': 'Civil Engineer',
      'مهندس معماري': 'Architect',
      'مهندس ميكانيكا': 'Mechanical Engineer',
      'مهندس كهرباء': 'Electrical Engineer',
      'مهندس زراعي': 'Agricultural Engineer',
      'مهندس ديكور': 'Interior Designer',
      'مدرس': 'Teacher',
      'أستاذ جامعي': 'University Professor',
      'معيد': 'Teaching Assistant',
      'مدير مدرسة': 'School Principal',
      'محاضر': 'Lecturer',
      'باحث أكاديمي': 'Academic Researcher',
      'محامي': 'Lawyer',
      'مستشار قانوني': 'Legal Advisor',
      'قاضي': 'Judge',
      'كاتب محتوى': 'Content Writer',
      'صحفي': 'Journalist',
      'مترجم': 'Translator',
      'مصور': 'Photographer',
      'مخرج': 'Director',
      'مونتير': 'Film Editor',
      'ممثل': 'Actor',
      'رسام': 'Painter',
      'طباخ': 'Cook',
      'شيف': 'Chef',
      'نادل': 'Waiter',
      'سائق': 'Driver',
      'ميكانيكي': 'Mechanic',
      'كهربائي منازل': 'Electrician',
      'نجار': 'Carpenter',
      'سباك': 'Plumber',
      'حداد': 'Blacksmith',
      'نقاش': 'Painter (House)',
      'حلاق': 'Barber',
      'خياط': 'Tailor',
      'طالب': 'Student',
      'عمل حر (Freelancer)': 'Freelancer',
      'مدرب رياضي': 'Sports Coach',
      'ضابط شرطة': 'Police Officer',
      'طيار': 'Pilot',
      'مضيف طيران': 'Flight Attendant'
    },
    degrees: {
      'ثانوية عامة': 'High School',
      'دبلوم فني': 'Technical Diploma',
      'دبلوم عالي': 'Higher Diploma',
      'بكالوريوس': 'Bachelor\'s Degree',
      'ليسانس': 'Licentiate',
      'ماجستير': 'Master\'s Degree',
      'دكتوراه': 'PhD',
      'زمالة': 'Fellowship'
    },
    languages_list: {
      'العربية': 'Arabic',
      'الإنجليزية': 'English',
      'الفرنسية': 'French',
      'الإسبانية': 'Spanish',
      'الألمانية': 'German',
      'الإيطالية': 'Italian',
      'التركية': 'Turkish',
      'الروسية': 'Russian',
      'الصينية': 'Chinese',
      'اليابانية': 'Japanese',
      'الكورية': 'Korean',
      'الهندية': 'Hindi',
      'البرتغالية': 'Portuguese',
      'الهولندية': 'Dutch',
      'اليونانية': 'Greek',
      'السويدية': 'Swedish',
      'الفارسية': 'Persian',
      'الأردية': 'Urdu'
    },
    months: {
      'يناير': 'January',
      'فبراير': 'February',
      'مارس': 'March',
      'أبريل': 'April',
      'مايو': 'May',
      'يونيو': 'June',
      'يوليو': 'July',
      'أغسطس': 'August',
      'سبتمبر': 'September',
      'أكتوبر': 'October',
      'نوفمبر': 'November',
      'ديسمبر': 'December'
    },
    chat_themes: {
      'افتراضي': 'Default',
      'محيط': 'Ocean',
      'حب': 'Love',
      'صداقة': 'Friendship',
      'هدوء': 'Tranquility',
      'غروب': 'Sunset',
      'توت': 'Berry',
      'غابة': 'Forest',
      'ليلي': 'Midnight',
      'مجرة': 'Galaxy',
      'صبغ': 'Tie Dye',
      'أرض': 'Earth'
    },
    emoji_categories: {
      'ابتسامات': 'Smileys',
      'حيوانات': 'Animals',
      'طعام': 'Food',
      'أنشطة': 'Activities',
      'سفر': 'Travel',
      'أشياء': 'Objects',
      'أعلام': 'Flags'
    },
    reactions: {
      'إعجاب': 'Like',
      'أحببته': 'Love',
      'أدعمك': 'Care',
      'هاها': 'Haha',
      'واو': 'Wow',
      'أحزنني': 'Sad',
      'أغضبني': 'Angry'
    },
    report_reasons: {
      'محتوى غير لائق': 'Inappropriate Content',
      'عنف أو مشاهد دموية': 'Violence or Graphic Content',
      'خطاب كراهية': 'Hate Speech',
      'معلومات مضللة': 'Misinformation',
      'سبام أو احتيال': 'Spam or Scam',
      'مضايقة': 'Harassment',
      'إساءة': 'Abuse',
      'خداع أو احتيال': 'Deception or Fraud',
      'انتحال شخصية شخص آخر': 'Impersonation',
    },
    group_rules: {
      'احترم جميع المتابعين ولا تستخدم ألفاظاً نابية': 'Respect all members and do not use offensive language.',
      'يمنع نشر المحتوى الإعلاني أو السبام': 'Advertising or spam content is not allowed.',
      'احرص أن تكون المنشورات ذات صلة بموضوع الصفحة': 'Ensure that posts are relevant to the page topic.',
      'يمنع نشر المعلومات الشخصية للآخرين': 'Publishing personal information of others is prohibited.'
    },
    cities: {
      // Egypt
      'القاهرة': 'Cairo',
      'الإسكندرية': 'Alexandria',
      'الجيزة': 'Giza',
      'المنصورة': 'Mansoura',
      'شرم الشيخ': 'Sharm El Sheikh',
      'أسوان': 'Aswan',
      'الأقصر': 'Luxor',
      'طنطا': 'Tanta',
      'بورسعيد': 'Port Said',
      'السويس': 'Suez',
      'الغردقة': 'Hurghada',
      'دمياط': 'Damietta',
      'الإسماعيلية': 'Ismailia',
      'الزقازيق': 'Zagazig',
      'المنيا': 'Minya',
      'أسيوط': 'Assiut',
      'سوهاج': 'Sohag',
      'كفر الشيخ': 'Kafr El Sheikh',
      'الفيوم': 'Faiyum',
      'بني سويف': 'Beni Suef',
      'قنا': 'Qena',
      'مطروح': 'Matrouh',
      'العريش': 'Arish',
      'شبرا الخيمة': 'Shubra El Kheima',
      'المحلة الكبرى': 'El Mahalla El Kubra',
      'دمنهور': 'Damanhour',
      '6 أكتوبر': '6th of October',
      'شبين الكوم': 'Shebin El Kom',
      'بنها': 'Banha',
      'ملوي': 'Mallawi',
      'العشر من رمضان': '10th of Ramadan',
      'بلبيس': 'Belbeis',
      'مرسى مطروح': 'Marsa Matruh',
      'إدفو': 'Edfu',
      'ميت غمر': 'Mit Ghamr',
      'الحوامدية': 'Hawamdia',
      'دسوق': 'Desouk',
      'قليوب': 'Qalyub',
      'أبو كبير': 'Abu Kabir',
      'كفر الدوار': 'Kafr El Dawar',
      'جرجا': 'Girga',
      'أخميم': 'Akhmim',
      'المطرية': 'Matareya',

      // Saudi Arabia
      'الرياض': 'Riyadh',
      'جدة': 'Jeddah',
      'مكة المكرمة': 'Mecca',
      'الدمام': 'Dammam',
      'المدينة المنورة': 'Medina',
      'الخبر': 'Khobar',
      'تبوك': 'Tabuk',
      'أبها': 'Abha',
      'الطائف': 'Taif',
      'بريدة': 'Buraydah',
      'خميس مشيط': 'Khamis Mushait',
      'الجبيل': 'Jubail',
      'حائل': 'Hail',
      'نجران': 'Najran',
      'جازان': 'Jazan',
      'الهفوف': 'Al Hofuf',
      'المبرز': 'Al Mubarraz',
      'القطيف': 'Qatif',
      'ينبع': 'Yanbu',
      'عرعر': 'Arar',
      'سكاكا': 'Sakaka',
      'الظهران': 'Dhahran',
      'الباحة': 'Al Bahah',
      'حفر الباطن': 'Hafar Al-Batin',
      'الخرج': 'Al-Kharj',
      'الثقبة': 'Thuqbah',
      'الرس': 'Ar Rass',
      'بيشة': 'Bisha',

      // UAE
      'دبي': 'Dubai',
      'أبو ظبي': 'Abu Dhabi',
      'الشارقة': 'Sharjah',
      'عجمان': 'Ajman',
      'رأس الخيمة': 'Ras Al Khaimah',
      'الفجيرة': 'Fujairah',
      'العين': 'Al Ain',
      'أم القيوين': 'Umm Al Quwain',
      'خورفكان': 'Khor Fakkan',
      'دبا الفجيرة': 'Dibba Al-Fujairah',
      'جبل علي': 'Jebel Ali',
      'مدينة زايد': 'Madinat Zayed',
      'الرويس': 'Ruwais',
      'ليوا': 'Liwa',
      'الذيد': 'Dhaid',
      'الغويفات': 'Ghuwaifat',

      // Kuwait
      'مدينة الكويت': 'Kuwait City',
      'حولي': 'Hawalli',
      'السالمية': 'Salmiya',
      'الأحمدي': 'Al Ahmadi',
      'الجهراء': 'Al Jahra',
      'الفروانية': 'Farwaniya',
      'مبارك الكبير': 'Mubarak Al-Kabeer',
      'الصباحية': 'Sabah Al Salem',
      'الفحيحيل': 'Fahaheel',

      // Qatar
      "الدوحة": "Doha",
      "الريان": "Al Rayyan",
      "الخور": "Al Khor",
      "الوكرة": "Al Wakrah",
      "أم صلال": "Umm Salal",
      "الشمال": "Ash Shamal",
      "مسيعيد": "Mesaieed",
      "دخان": "Dukhan",

     // Bahrain
      "المنامة": "Manama",
      "المحرق": "Muharraq",
      "الرفاع": "Riffa",
      "مدينة حمد": "Hamad Town",
      "مدينة عيسى": "Isa Town",
      "الحد": "Al Hidd",
      "سترة": "Sitrah",
      "البديع": "Budaiya",

     // Oman
      "مسقط": "Muscat",
      "صلالة": "Salalah",
      "صحار": "Sohar",
      "نزوى": "Nizwa",
      "صور": "Sur",
      "البريمي": "Al Buraimi",
      "السيب": "Seeb",
      "عبري": "Ibri",
      "إبراء": "Ibra",
      "خصب": "Khasab",

     // Jordan
      "عمان": "Amman",
      "الزرقاء": "Zarqa",
      "إربد": "Irbid",
      "العقبة": "Aqaba",
      "السلط": "Salt",
      "مادبا": "Madaba",
      "الكرك": "Karak",
      "جرش": "Jerash",
      "المفرق": "Mafraq",
      "معان": "Ma'an",
      "عجلون": "Ajloun",
      "الطفيلة": "Tafilah",

     // Lebanon
      "بيروت": "Beirut",
      "طرابلس": "Tripoli",
      "صيدا": "Sidon",
      "صور": "Tyre",
      "جونيه": "Jounieh",
      "زحلة": "Zahlé",
      "بعلبك": "Baalbek",
      "جبيل": "Byblos",
      "النبطية": "Nabatieh",
      "عاليه": "Aley",

     // Iraq
      "بغداد": "Baghdad",
      "البصرة": "Basra",
      "الموصل": "Mosul",
      "أربيل": "Erbil",
      "النجف": "Najaf",
      "كربلاء": "Karbala",
      "كركوك": "Kirkuk",
      "السليمانية": "Sulaymaniyah",
      "الرمادي": "Ramadi",
      "الفلوجة": "Fallujah",
      "الحلة": "Hillah",
      "الناصرية": "Nasiriyah",
      "العمارة": "Amarah",
      "الديوانية": "Diwaniyah",
      "الكوت": "Kut",
      "دهوك": "Dohuk",
      "سامراء": "Samarra",

     // Syria
      "دمشق": "Damascus",
      "حلب": "Aleppo",
      "حمص": "Homs",
      "اللاذقية": "Latakia",
      "حماة": "Hama",
      "طرطوس": "Tartus",
      "الرقة": "Raqqa",
      "دير الزور": "Deir ez-Zor",
      "الحسكة": "Hasakah",
      "إدلب": "Idlib",
      "درعا": "Daraa",
      "السويداء": "Sweida",

     // Palestine
      "القدس": "Jerusalem",
      "غزة": "Gaza",
      "رام الله": "Ramallah",
      "نابلس": "Nablus",
      "الخليل": "Hebron",
      "بيت لحم": "Bethlehem",
      "أريحا": "Jericho",
      "جنين": "Jenin",
      "طولكرم": "Tulkarm",
      "رفح": "Rafah",
      "خان يونس": "Khan Yunis",
      "قلقيلية": "Qalqilya",
      "دير البلح": "Deir al-Balah",

     // Morocco
      "الدار البيضاء": "Casablanca",
      "الرباط": "Rabat",
      "مراكش": "Marrakesh",
      "فاس": "Fes",
      "طنجة": "Tangier",
      "أكادير": "Agadir",
      "مكناس": "Meknes",
      "وجدة": "Oujda",
      "القنيطرة": "Kenitra",
      "تطوان": "Tetouan",
      "آسفي": "Safi",
      "تمارة": "Temara",
      "العيون": "Laayoune",
      "المحمدية": "Mohammedia",
      "الجديدة": "El Jadida",
      "بني ملال": "Beni Mellal",

     // Tunisia
      "تونس": "Tunis",
      "صفاقس": "Sfax",
      "سوسة": "Sousse",
      "المنستير": "Monastir",
      "القيروان": "Kairouan",
      "بنزرت": "Bizerte",
      "قابس": "Gabès",
      "أريانة": "Ariana",
      "القصرين": "Kasserine",
      "قفصة": "Gafsa",
      "توزر": "Tozeur",
      "جربة": "Djerba",

     // Algeria
      "الجزائر": "Algiers",
      "وهران": "Oran",
      "قسنطينة": "Constantine",
      "عنابة": "Annaba",
      "البليدة": "Blida",
      "تلمسان": "Tlemcen",
      "سطيف": "Sétif",
      "باتنة": "Batna",
      "بجاية": "Béjaïa",
      "سكيكدة": "Skikda",
      "سيدي بلعباس": "Sidi Bel Abbès",
      "مستغانم": "Mostaganem",
      "بسكرة": "Biskra",

     // Libya
      "طرابلس": "Tripoli",
      "بنغازي": "Benghazi",
      "مصراتة": "Misrata",
      "البيضاء": "Al Bayda",
      "طبرق": "Tobruk",
      "الزاوية": "Zawiya",
      "سبها": "Sabha",
      "سرت": "Sirte",
      "أجدابيا": "Ajdabiya",
      "درنة": "Derna",

     // Sudan
      "الخرطوم": "Khartoum",
      "أم درمان": "Omdurman",
      "بورتسودان": "Port Sudan",
      "نيالا": "Nyala",
      "كسلا": "Kassala",
      "الأبيض": "El Obeid",
      "القضارف": "Gedaref",
      "كوستي": "Kosti",
      "واد مدني": "Wad Madani",

     // Yemen
      "صنعاء": "Sana'a",
      "عدن": "Aden",
      "تعز": "Taiz",
      "الحديدة": "Al Hudaydah",
      "المكلا": "Mukalla",
      "إب": "Ibb",
      "ذمار": "Dhamar",
      "عمران": "Amran",
      "صعدة": "Saada",

     // Mauritania
      "نواكشوط": "Nouakchott",
      "نواذيبو": "Nouadhibou",
      "كيفه": "Kiffa",
      "روصو": "Rosso",
      "كيهيدي": "Kaédi",

     // Somalia
      "مقديشو": "Mogadishu",
      "هرجيسا": "Hargeisa",
      "بوصاصو": "Bosaso",
      "جالكعيو": "Galkayo",
      "بربرة": "Berbera",

     // Djibouti
      "جيبوتي": "Djibouti",
      "علي صبيح": "Ali Sabieh",
      "تاجورة": "Tadjoura",
      "دخيل": "Dikhil",

     // Comoros
      "موروني": "Moroni",
      "موتسامودو": "Mutsamudu",
      "فومبوني": "Fomboni",

     // Turkey
      "إسطنبول": "Istanbul",
      "أنقرة": "Ankara",
      "إزمير": "Izmir",
      "أنطاليا": "Antalya",
      "بورصة": "Bursa",
      "غازي عنتاب": "Gaziantep",
      "أضنة": "Adana",
      "قونية": "Konya",
      "مرسين": "Mersin",
      "ديار بكر": "Diyarbakr",
      "قيصري": "Kayseri",
      "سامسون": "Samsun",

     // United States
      "نيويورك": "New York",
      "لوس أنجلوس": "Los Angeles",
      "شيكاغو": "Chicago",
      "هيوستن": "Houston",
      "واشنطن": "Washington",
      "ميامي": "Miami",
      "سان فرانسيسكو": "San Francisco",
      "بوسطن": "Boston",
      "سياتل": "Seattle",
      "دالاس": "Dallas",
      "أتلانتا": "Atlanta",
      "فيلادلفيا": "Philadelphia",
      "فينيكس": "Phoenix",
      "ديترويت": "Detroit",
      "سان دييغو": "San Diego",
      
     // United Kingdom
      "لندن": "London",
      "مانشستر": "Manchester",
      "ليفربول": "Liverpool",
      "برمنغهام": "Birmingham",
      "ليدز": "Leeds",
      "غلاسكو": "Glasgow",
      "أدنبرة": "Edinburgh",
      "بريستول": "Bristol",
      "شفيلد": "Sheffield",
      "كارديف": "Cardiff",
      "بلفاست": "Belfast",

     // Germany
      "برلين": "Berlin",
      "ميونخ": "Munich",
      "هامبورغ": "Hamburg",
      "فرانكفورت": "Frankfurt",
      "كولونيا": "Cologne",
      "شتوتغارت": "Stuttgart",
      "دوسلدورف": "Düsseldorf",
      "دورتموند": "Dortmund",
      "إيسن": "Essen",
      "لايبزيغ": "Leipzig",

     // France
      "باريس": "Paris",
      "ليون": "Lyon",
      "مارسيليا": "Marseille",
      "تولوز": "Toulouse",
      "نيس": "Nice",
      "بوردو": "Bordeaux",
      "ستراسبورغ": "Strasbourg",
      "نانت": "Nantes",
      "مونبلييه": "Montpellier",
      "ليل": "Lille",

     // Italy
      "روما": "Rome",
      "ميلانو": "Milan",
      "نابولي": "Naples",
      "تورينو": "Turin",
      "البندقية": "Venice",
      "فلورنسا": "Florence",
      "بولونيا": "Bologna",
      "جنوة": "Genoa",
      "باري": "Bari",
      "باليرمو": "Palermo",

     // Spain
      "مدريد": "Madrid",
      "برشلونة": "Barcelona",
      "فالنسيا": "Valencia",
      "إشبيلية": "Seville",
      "ملقة": "Málaga",
      "بلباو": "Bilbao",
      "سرقسطة": "Zaragoza",
      "مايوركا": "Mallorca",

     // Canada
      "تورونتو": "Toronto",
      "مونتريال": "Montreal",
      "فانكوفر": "Vancouver",
      "كالجاري": "Calgary",
      "أوتاوا": "Ottawa",
      "إدمونتون": "Edmonton",
      "كيبيك": "Quebec City",
      "وينيبيغ": "Winnipeg",

     // Australia
      "سيدني": "Sydney",
      "ملبورن": "Melbourne",
      "بريزبن": "Brisbane",
      "بيرث": "Perth",
      "أديلايد": "Adelaide",
      "كانبرا": "Canberra",
      "جولد كوست": "Gold Coast",

     // India
      "نيودلهي": "New Delhi",
      "مومباي": "Mumbai",
      "بنغالور": "Bengaluru",
      "تشيناي": "Chennai",
      "حيدر أباد": "Hyderabad",
      "كولكاتا": "Kolkata",
      "أحمد أباد": "Ahmedabad",
      "بونه": "Pune",

     // China
      "بكين": "Beijing",
      "شانغهاي": "Shanghai",
      "غوانزو": "Guangzhou",
      "شنتشن": "Shenzhen",
      "تشنغدو": "Chengdu",
      "ووهان": "Wuhan",
      "تيانجين": "Tianjin",
      "هانغتشو": "Hangzhou",

     // Japan
      "طوكيو": "Tokyo",
      "أوساكا": "Osaka",
      "يوكوهاما": "Yokohama",
      "ناغويا": "Nagoya",
      "سوبورو": "Sapporo",
      "كيوتو": "Kyoto",
      "كوبي": "Kobe",
      "فوكوكا": "Fukuoka",

     // Brazil
      "ساو باولو": "São Paulo",
      "ريو دي جانيرو": "Rio de Janeiro",
      "برازيليا": "Brasília",
      "سلفادور": "Salvador",
      "فورتاليزا": "Fortaleza",
      "بيلو هوريزونتي": "Belo Horizonte",

     // Russia
      "موسكو": "Moscow",
      "سانت بطرسبرغ": "Saint Petersburg",
      "نوفوسيبيرسك": "Novosibirsk",
      "يكاترينبورغ": "Yekaterinburg",
      "قازان": "Kazan",
      "نيجني نوفغورود": "Nizhny Novgorod",

      // ... Add mappings for all other major cities referenced in data files as needed
      'الدوحة': 'Doha',
      'المنامة': 'Manama',
      'مسقط': 'Muscat',
      'عمان': 'Amman',
      'بيروت': 'Beirut',
      'بغداد': 'Baghdad',
      'الجزائر': 'Algiers',
      'تونس': 'Tunis',
      'الرباط': 'Rabat',
      'الدار البيضاء': 'Casablanca',                              
      'نيويورك': 'New York',
      'لندن': 'London',
      'باريس': 'Paris',
      'برلين': 'Berlin',
      'إسطنبول': 'Istanbul'
    }
  },
  en: {
    dir: 'ltr',
    common: {
      loading: 'Loading...',
      online: 'Online',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      close: 'Close',
      done: 'Done',
      view_more: 'See more',
      view_less: 'See less',
      view_all: 'View All',
      search: 'Search',
      send: 'Send',
      copy: 'Copy',
      share: 'Share',
      download: 'Download',
      report: 'Report',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      prev: 'Previous',
      yes: 'Yes',
      no: 'No',
      success: 'Success',
      error: 'Error',
      copied: 'Copied',
      remove: 'Remove',
      unknown: 'Unknown',
      create: 'Create',
      update: 'Update',
      filter: 'Filter',
      reset: 'Reset',
      all: 'All',
      more: 'More',
      less: 'Less',
      likes: 'Likes',
      comments: 'Comments',
      views: 'Views',
      followers: 'Followers',
      members: 'Members',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      description: 'Description',
      category: 'Category',
      notifications: 'Notifications',
      mute: 'Mute',
      unmute: 'Unmute',
      pin: 'Pin',
      unpin: 'Unpin',
      join: 'Join',
      leave: 'Leave',
      joined: 'Joined',
      visit: 'Visit',
      invite: 'Invite',
      admin: 'Admin',
      moderator: 'Moderator',
      member: 'Member',
      owner: 'Owner',
      public: 'Public',
      private: 'Private',
      general: 'General',
      appearance: 'Appearance',
      rules: 'Rules',
      mark_read: 'Mark all as read',
      new_message: 'New Message',
      no_results: 'No results',
    },
    auth: {
      login_title: 'Log In',
      signup_title: 'Create New Account',
      email_label: 'Email Address',
      password_label: 'Password',
      confirm_password_label: 'Confirm Password',
      name_label: 'Full Name',
      login_btn: 'Log In',
      signup_btn: 'Sign Up',
      forgot_password: 'Forgot Password?',
      remember_me: 'Remember me',
      or_continue: 'Or continue with',
      have_account: 'Already have an account?',
      no_account: 'Don\'t have an account?',
      reset_pass_title: 'Reset Password',
      reset_pass_desc: 'Enter your email to send reset instructions',
      send_reset_link: 'Send Reset Link',
      back_login: 'Back to Login',
      secure_badge: 'Protected by Tourloop Secure',
      login_desc: 'Please enter your details to sign in',
      signup_desc: 'Fill in the details to join us'
    },
    nav: {
      home: 'Home',
      friends: 'Friends',
      watch: 'Watch',
      market: 'Marketplace',
      gaming: 'Gaming',
      groups: 'Groups',
      pages: 'Pages',
      events: 'Events',
      memories: 'Memories',
      saved: 'Saved Items',
      search_placeholder: 'Search Tourloop',
      profile: 'Profile',
      settings: 'Settings & Privacy',
      logout: 'Log Out',
      dark_mode: 'Dark Mode',
      light_mode: 'Light Mode',
      language: 'Language',
      notifications: 'Notifications',
      messages: 'Messages',
      friend_requests: 'Friend Requests',
      view_all: 'View All',
      mark_read: 'Mark all as read',
      new_message: 'New Message',
      active_now: 'Active Now',
      offline: 'Offline',
    },
    sidebar: {
      shortcuts: 'Your Shortcuts',
      privacy_footer: 'Privacy · Terms · Advertising · Meta © 2024',
      add_shortcut: 'Add Shortcut',
      no_shortcuts: 'No shortcuts'
    },
    post: {
      create_placeholder: "What's on your mind,",
      live_video: 'Live Video',
      photo_video: 'Photo/Video',
      feeling_activity: 'Feeling/Activity',
      magic_ai: 'Magic AI',
      publish: 'Post',
      ai_thinking: 'Thinking...',
      pinned: 'Pinned Post',
      like: 'Like',
      comment: 'Comment',
      write_comment: 'Write a comment...',
      reply: 'Reply',
      view_comments: 'View comments',
      delete_confirm_title: 'Delete Post?',
      delete_confirm_desc: 'Are you sure you want to delete this post? This action cannot be undone.',
      save_post: 'Save Post',
      unsave_post: 'Unsave Post',
      copy_link: 'Copy Link',
      turn_off_notif: 'Turn off notifications',
      turn_on_notif: 'Turn on notifications',
      edit_post: 'Edit Post',
      feeling_label: 'Feeling',
      activity_label: 'Celebrating',
      with: 'with',
      at: 'at',
      tag_button: 'Tag',
      location_button: 'Location',
      audience: 'Edit Audience',
      delete: 'Delete Post',
      report: 'Report Post',
      save: 'Save Post',
      unsave: 'Unsave Post',
      likes_count: 'Likes',
      comments_count: 'Comments',
      shares_count: 'Shares',
    },
    profile: {
      posts: 'Posts',
      about: 'About',
      friends: 'Friends',
      photos: 'Photos',
      videos: 'Videos',
      groups: 'Groups',
      events: 'Events',
      more: 'More',
      message: 'Message',
      add_friend: 'Add Friend',
      request_sent: 'Request Sent',
      is_friend: 'Friends',
      edit_profile: 'Edit Profile',
      edit_cover: 'Edit Cover Photo',
      edit_details: 'Edit Details',
      add_story: 'Add to Story',
      view_story: 'View Story',
      view_avatar: 'View Profile Picture',
      change_name: 'Change Name',
      unfriend: 'Unfriend',
      block: 'Block',
      mutual_friends: 'Mutual Friends',
      friend_count: 'Friends',
      no_posts: 'No posts yet',
      no_posts_desc: 'When this user posts updates, they will appear here.',
      no_photos: 'No photos to show',
      no_videos: 'No videos',
      no_friends: 'No friends to show',
      pages: 'Pages',
      joined_date: 'Joined on',
    },
    profile_intro: {
      edit_hobbies: 'Edit Hobbies',
      add_hobbies: 'Add Hobbies',
      edit_featured: 'Edit Featured',
      add_featured: 'Add Featured Photos',
      joined_in: 'Joined in',
      joined_recent: 'Joined recently',
      no_hobbies: 'No hobbies added',
      no_featured: 'No featured items',
      hobbies_modal_title: 'Add Hobbies',
      hobbies_search: 'What are your hobbies?',
      hobbies_suggested: 'Suggested Hobbies',
      featured_info: 'Choose photos that represent you to appear at the top of your profile.',
      upload_error: 'Error uploading'
    },
    profile_friends: {
      tab_all: 'All',
      tab_suggestions: 'Suggestions',
      tab_mutual: 'Mutual Friends',
      tab_work: 'Work',
      tab_university: 'University',
      tab_city: 'Current City',
      search_placeholder: 'Search...',
      privacy_title: 'Who can see your friends list?',
      privacy_desc: 'Control the privacy of your friends list.',
      visit_profile: 'Visit Profile',
      unfriend_confirm: 'Are you sure you want to unfriend',
      block_confirm: 'Are you sure you want to block',
      no_results: 'No results',
      no_suggestions: 'No suggestions currently',
      friend_requests: 'Friend Requests',
      people_you_may_know: 'People You May Know',
      confirm: 'Confirm',
      delete_request: 'Delete'
    },
    profile_about: {
      overview: 'Overview',
      work_edu: 'Work and Education',
      places: 'Places Lived',
      contact_basic: 'Contact and Basic Info',
      family_rel: 'Family and Relationships',
      details: 'Details About You',
      life_events: 'Life Events',
      works_at: 'Works at',
      role_at: 'at',
      studied: 'Studied',
      at: 'at',
      class_of: 'Class of',
      went_to: 'Went to',
      lives_in: 'Lives in',
      from: 'From',
      mobile: 'Mobile',
      email: 'Email',
      website: 'Website',
      gender: 'Gender',
      birth_date: 'Birth Date',
      languages: 'Languages',
      pronounce: 'Pronounces name',
      quotes: 'Favorite Quotes',
      blood_donation: 'Blood Donations',
      other_names: 'Other Names',
      no_details: 'No details to show in Overview.',
      add_work: 'Add a workplace',
      add_edu: 'Add college / university',
      add_place: 'Add current city',
      add_mobile: 'Add mobile number',
      add_bio: 'Write some details about yourself',
      ph_position: 'Job Title',
      ph_company: 'Company Name',
      ph_school: 'School Name',
      ph_city: 'City',
      ph_desc_self: 'Describe yourself...',
      ph_quote: 'Add your favorite quote...',
      ph_pronounce: 'How do you pronounce your name?',
      basic_info: 'Basic Info',
      degree: 'Degree',
      major: 'Major',
      platform: 'Platform',
      username_url: 'Username / URL',
      name_type: 'Name Type',
      name_label: 'Name',
      relationship_status: 'Relationship Status',
      partner: 'Partner',
      family_member: 'Family Member',
      family_members: 'Family Members',
      relation: 'Relationship',
      event_name: 'Event Name',
      event_location: 'Event Location',
      event_desc: 'Event Description',
      empty_work: 'Add Work',
      empty_uni: 'Add University',
      empty_school: 'Add High School',
      empty_current_city: 'Add Current City',
      empty_hometown: 'Add Hometown',
      empty_rel: 'Add Relationship',
      empty_family: 'Add Family Member',
      empty_mobile: 'Add Mobile',
      no_mobile: 'No mobile number',
      empty_email: 'Add Email',
      no_email: 'No email address',
      contact_mobile: 'Mobile',
      contact_email: 'Email',
      contact_website: 'Website',
      empty_website: 'Add Website',
      empty_social: 'Add Social Link',
      basic_gender: 'Gender',
      empty_gender: 'Add Gender',
      basic_birth: 'Birth Date',
      empty_birth: 'Add Birth Date',
      basic_lang: 'Languages',
      empty_lang: 'Add Language',
      no_lang: 'No languages',
      details_pronounce: 'Pronunciation',
      empty_pronounce: 'Add Pronunciation',
      details_quotes: 'Favorite Quotes',
      details_blood: 'Blood Donation',
      empty_quotes: 'Add Quote',
      empty_other_name: 'Add Other Name',
      empty_events: 'Add Life Event',
      about_overview: 'Overview',
      about_work_edu: 'Work and Education',
      about_places: 'Places Lived',
      about_contact: 'Contact and Basic Info',
      about_family: 'Family and Relationships',
      about_details: 'Details About You',
      about_events: 'Life Events',
      btn_edit: 'Edit',
      btn_delete: 'Delete',
      btn_cancel: 'Cancel',
      btn_save: 'Save',
      btn_view_more: 'View More'
    },
    profile_photos: {
     your_photos: 'Your Photos',
     tagged_photos: 'Photos of You',
     albums: 'Albums',
     create_album: 'Create Album',
     add_photo: 'Add Photo',
     empty_album: 'This album is empty',
     album_name: 'Album Name',
     upload_hint: 'Tap to add photos from your device',
     profile_pictures: 'Profile Pictures',
     cover_photos: 'Cover Photos'
    },
    profile_videos: {
      videos: 'Videos',
      reels: 'Reels',
      add_video: 'Add Video',
      no_videos: 'No videos',
      no_reels: 'No reels'
    },
    market: {
      title: 'Marketplace',
      search_placeholder: 'Search Marketplace...',
      create_listing: 'Create New Listing',
      categories: 'Categories',
      filters: 'Filters',
      price: 'Price',
      location: 'Location',
      condition: 'Condition',
      description: 'Description',
      seller_info: 'Seller Info',
      message_seller: 'Message Seller',
      safety_tips: 'Safety Tips',
      saved_items: 'Saved Items',
      browse: 'Browse',
      no_results: 'No matching products',
      free: 'Free',
      sold: 'Sold',
      sort_by: 'Sort by',
      newest: 'Newest',
      price_low: 'Price: Low to High',
      price_high: 'Price: High to Low',
      min_price: 'Min',
      max_price: 'Max',
      location_radius: 'Within 60 km',
      change_location: 'Change',
      today_picks: "Today's Picks",
      saved_products: 'Saved Products',
      new: 'New',
      used_good: 'Used - Good',
      used_fair: 'Used - Fair',
      product_link: 'Product Link',
      photos: 'Photos',
      title_label: 'Title',
      country: 'Country',
      city: 'City',
      currency: 'Currency',
      publish_listing: 'Publish Listing',
      preview: 'Preview Listing',
      add_photos: 'Add Photos',
      photo_limit_hint: 'Up to 8 photos',
      tips_1: 'Do not send money before receiving the product.',
      tips_2: 'Check the item carefully before purchasing.',
      tips_3: 'Meet the seller in a safe, public place.',
      verified_phone: 'Phone Verified',
      joined_since: 'Joined',
      ask_seller: 'Ask seller a question...',
      delete_product: 'Delete Product',
      delete_confirm_title: 'Delete Product?',
      delete_confirm_desc: 'Are you sure you want to delete this product? This action cannot be undone.',
      cats: {
        vehicles: 'Vehicles',
        electronics: 'Electronics',
        computers: 'Computers',
        property: 'Property Rentals',
        furniture: 'Furniture',
        apparel: 'Apparel',
        baby: 'Baby & Kids',
        sports: 'Sports',
        entertainment: 'Entertainment',
        hobbies: 'Hobbies',
        books: 'Books',
        pets: 'Pets',
        services: 'Services',
        tools: 'Tools',
        art: 'Art & Crafts',
        bikes: 'Bikes',
        accessories: 'Jewelry & Watches',
        appliances: 'Appliances'
      }
    },
     gaming: {
      title: 'Gaming',
      home: 'Home',
      instant_games: 'Instant Games',
      live_stream: 'Live Stream',
      saved_games: 'Saved Games',
      categories: 'Categories',
      play_now: 'Play Now',
      follow: 'Follow',
      unfollow: 'Unfollow',
      viewers: 'viewers',
      live_now: 'Live Now',
      suggested: 'Suggested for You',
      search_placeholder: 'Search games & streams...',
      back_to_menu: 'Back to Main Menu',
      cats: {
        action: 'Action',
        shooter: 'Shooter',
        adventure: 'Adventure',
        strategy: 'Strategy',
        sports: 'Sports',
        racing: 'Racing',
        puzzle: 'Puzzle',
        arcade: 'Arcade',
        horror: 'Horror',
        simulation: 'Simulation',
        board: 'Board'
      },
      hero_title: 'Grand Championship Finals',
      hero_desc: 'Watch the best players compete for the title in an epic battle you cannot miss!',
      watch_stream: 'Watch Stream',
      stream_by: 'Live by',
      chat_welcome: 'Welcome to the chat!',
      send_message: 'Send a message...',
      share_game: 'Share this game',
      share_stream: 'Share this stream',
      game_ready: 'Game Ready!',
      loading_game: 'Loading game...',
      score: 'Score',
      game_over: 'Game Over',
      play_again: 'Play Again',
      moves: 'Moves',
      congrats: 'Congrats!',
      you_won: 'You Won!',
      computer_won: 'Computer Won!',
      draw: 'Draw!',
      your_choice: 'Your Choice',
      computer_choice: 'Computer',
      rock: 'Rock',
      paper: 'Paper',
      scissors: 'Scissors',
      math_challenge: 'Math Challenge',
      math_desc: 'Solve as many problems as possible in 30s!',
      snake_paused: 'Paused',
      snake_playing: 'Playing',
      snake_controls: 'Use arrow keys to control the snake',
      rps_title: 'Rock Paper Scissors',
    },
    date_now: 'Now',
    write_comment: 'Write a comment...',
    friend_count: 'friends',
    
    groups: {
      title: 'Groups',
      create_group: 'Create Group',
      join: 'Join',
      leave: 'Leave',
      joined: 'Joined',
      members: 'Members',
      about: 'About',
      discussion: 'Discussion',
      files: 'Files',
      admin_tools: 'Admin Tools',
      pending_requests: 'Member Requests',
      rules: 'Rules',
      invite: 'Invite',
      private_group: 'Private Group',
      public_group: 'Public Group',
      member_count: 'Member',
      discover: 'Discover',
      managed_groups: 'Managed Groups',
      joined_groups: 'Joined Groups',
      search_placeholder: 'Search Groups...',
      create_modal_title: 'Create New Group',
      group_name: 'Group Name',
      privacy_hint: 'Anyone can see group members and what they post.',
      edit_group: 'Edit Group',
      general: 'General',
      appearance: 'Appearance',
      cover_photo: 'Cover Photo',
      change_cover: 'Change Cover',
      group_color: 'Group Color',
      add_rule: 'Add new rule...',
      no_rules: 'No rules added yet.',
      manage_members: 'Manage Members',
      add_member: 'Add Member',
      search_member: 'Search member...',
      role: 'Role',
      remove_member: 'Remove',
      events: 'Events',
      media: 'Media',
      photos: 'Photos',
      videos: 'Videos',
      files_tab: 'Group Files',
      upload_file: 'Upload File',
      create_event: 'Create Event',
      event_title: 'Event Title',
      event_date: 'Date',
      event_time: 'Time',
      event_location: 'Location',
      event_desc: 'Description',
      going: 'Going',
      interested: 'Interested',
      admin_dashboard: 'Admin Dashboard',
      overview: 'Overview',
      reports: 'Reports',
      activity_log: 'Activity Log',
      total_members: 'Total Members',
      posts_this_month: 'Posts this month',
      pending_count: 'Pending Requests',
      quick_settings: 'Quick Settings',
      post_approval: 'Post Approval',
      post_approval_hint: 'Admin must approve posts before they appear',
      admin_notifs: 'Admin Notifications',
      admin_notifs_hint: 'Get notified of important activity',
      approve: 'Approve',
      reject: 'Reject',
      keep_content: 'Ignore (Keep)',
      delete_content: 'Delete Content',
      report_reason: 'Please select a reason',
      pinned_group: 'Pinned Group',
      pin_group: 'Pin Group',
      unpin_group: 'Unpin Group',
      copy_link: 'Copy Group Link',
      leave_confirm_title: 'Leave Group?',
      leave_confirm_desc: 'Are you sure you want to leave this group? You won\'t see private posts.',
      delete_confirm_title: 'Delete Group?',
      delete_confirm_desc: 'Are you sure you want to delete this group permanently? This cannot be undone.',
      delete_post_confirm_title: 'Delete Post?',
      delete_post_confirm_desc: 'Are you sure you want to delete this post from the group?',
      no_posts: 'No posts yet',
      be_first: 'Start the conversation and be the first to post!'
    },
    pages: {
      title: 'Pages',
      create_page: 'Create Page',
      liked_pages: 'Liked Pages',
      my_pages: 'My Pages',
      discover: 'Discover',
      search_placeholder: 'Search Pages...',
      like: 'Like',
      liked: 'Liked',
      follow: 'Follow',
      followed: 'Following',
      message: 'Message',
      contact: 'Contact Info',
      website: 'Website',
      email: 'Email',
      phone: 'Phone',
      category: 'Category',
      followers: 'Followers',
      likes_count: 'Likes',
      posts: 'Posts',
      about: 'About',
      photos: 'Photos',
      videos: 'Videos',
      community: 'Community',
      edit_page: 'Edit Page',
      manage_roles: 'Manage Roles',
      delete_page: 'Delete Page',
      create_modal_title: 'Create New Page',
      page_name: 'Page Name',
      page_category: 'Category',
      page_desc: 'Description',
      delete_confirm_title: 'Delete Page?',
      delete_confirm_desc: 'Are you sure you want to delete this page permanently?',
      no_pages: 'No pages found',
      invite_friends: 'Invite Friends',
      admin_roles: 'Admins & Moderators',
      assign_role: 'Assign New Role'
    },
    memories: {
      title: 'Memories',
      on_this_day: 'On This Day',
      recent: 'Recent Memories',
      settings: 'Settings',
      notification_pref: 'Notification Preferences',
      hidden_people: 'Hidden People',
      hidden_dates: 'Hidden Dates',
      people_hide_title: 'People to hide',
      dates_hide_title: 'Dates to hide',
      search_people: 'Search for people to hide...',
      select_date: 'Select Date',
      add_date: 'Add Date',
      save_changes: 'Save Changes',
      share_memory: 'Share Memory',
      no_memories: 'No memories to see today',
      notify_me: 'Notify me when memories appear',
      years_ago: 'years ago',
      year_ago: 'year ago'
    },
    privacy: {
      public: 'Public',
      friends: 'Friends',
      friends_except: 'Friends except...',
      only_me: 'Only me',
      custom: 'Custom'
    },
    placeholders: {
      select_option: 'Select...',
      type_message: 'Type a message...',
      search: 'Search...'
    },
    errors: {
      required: 'This field is required',
      invalid_email: 'Invalid email address',
      password_short: 'Password is too short',
      password_mismatch: 'Passwords do not match',
      file_too_large: 'File is too large',
      unsupported_file: 'Unsupported file type',
      generic: 'Something went wrong, please try again'
    },
    countries: {
      'مصر': 'Egypt',
      'السعودية': 'Saudi Arabia',
      'الإمارات': 'UAE',
      'الكويت': 'Kuwait',
      'قطر': 'Qatar',
      'البحرين': 'Bahrain',
      'عمان': 'Oman',
      'الأردن': 'Jordan',
      'لبنان': 'Lebanon',
      'العراق': 'Iraq',
      'سوريا': 'Syria',
      'فلسطين': 'Palestine',
      'المغرب': 'Morocco',
      'تونس': 'Tunisia',
      'الجزائر': 'Algeria',
      'ليبيا': 'Libya',
      'السودان': 'Sudan',
      'اليمن': 'Yemen',
      'موريتانيا': 'Mauritania',
      'الصومال': 'Somalia',
      'جيبوتي': 'Djibouti',
      'جزر القمر': 'Comoros',
      'تركيا': 'Turkey',
      'الولايات المتحدة': 'United States',
      'المملكة المتحدة': 'United Kingdom',
      'ألمانيا': 'Germany',
      'فرنسا': 'France',
      'إيطاليا': 'Italy',
      'إسبانيا': 'Spain',
      'كندا': 'Canada',
      'أستراليا': 'Australia',
      'الهند': 'India',
      'الصين': 'China',
      'اليابان': 'Japan',
      'البرازيل': 'Brazil',
      'روسيا': 'Russia'
    },
    relationship_statuses: {
      'أعزب': 'Single',
      'مرتبط': 'In a relationship',
      'مخطوب': 'Engaged',
      'متزوج': 'Married',
      'في علاقة مدنية': 'In a civil union',
      'في علاقة مفتوحة': 'In an open relationship',
      'علاقة معقدة': 'It\'s complicated',
      'منفصل': 'Separated',
      'مطلق': 'Divorced',
      'أرمل': 'Widowed'
    },
    family_relations: {
      'أب': 'Father',
      'أم': 'Mother',
      'أخ': 'Brother',
      'أخت': 'Sister',
      'ابن': 'Son',
      'ابنة': 'Daughter',
      'عم/خال': 'Uncle',
      'عمة/خالة': 'Aunt',
      'جد': 'Grandfather',
      'جدة': 'Grandmother',
      'ابن أخ/أخت': 'Nephew',
      'ابنة أخ/أخت': 'Niece',
      'ابن عم/خال': 'Cousin (M)',
      'ابنة عم/خال': 'Cousin (F)',
      'زوج الأب': 'Stepfather',
      'زوجة الأب': 'Stepmother'
    },
    name_types: {
      'اسم الشهرة': 'Nickname',
      'اسم قبل الزواج': 'Maiden Name',
      'طريقة كتابة بديلة': 'Alternative Spelling',
      'اسم المتزوجة': 'Married Name',
      'اسم الأب': 'Father\'s Name',
      'اسم الميلاد': 'Birth Name',
      'اسم سابق': 'Former Name',
      'اسم مع لقب': 'Name with Title',
      'آخر': 'Other'
    },
    feelings: {
      'سعيد': 'Happy',
      'محبوب': 'Loved',
      'حزين': 'Sad',
      'متحمس': 'Excited',
      'محبط': 'Frustrated',
      'شاكر': 'Thankful',
      'غاضب': 'Angry',
      'رائع': 'Cool',
      'متعب': 'Tired',
      'مفكر': 'Thinking',
      'مبارك': 'Blessed',
      'حائر': 'Confused',
      'قوي': 'Strong',
      'نعسان': 'Sleepy',
      'مريض': 'Sick',
      'مصدوم': 'Shocked',
      'واثق': 'Confident',
      'ممتن': 'Grateful',
      'فخور': 'Proud',
      'مرتاح': 'Relaxed',
      'قلق': 'Worried',
      'وحيد': 'Lonely',
      'مندهش': 'Surprised',
      'خجول': 'Shy',
      'جائع': 'Hungry',
      'مستاء': 'Annoyed',
      'متفائل': 'Optimistic',
      'مبدع': 'Creative',
      'نشيط': 'Energetic',
      'هادئ': 'Calm'
    },
    activities: {
      'يحتفل': 'Celebrating',
      'يشاهد': 'Watching',
      'يأكل': 'Eating',
      'يشرب': 'Drinking',
      'يسافر إلى': 'Traveling to',
      'يستمع إلى': 'Listening to',
      'يقرأ': 'Reading',
      'يلعب': 'Playing',
      'يفكر في': 'Thinking about',
      'يدعم': 'Supporting',
      'يبحث عن': 'Looking for',
      'يتعلم': 'Learning',
      'يعمل': 'Working',
      'يتمرن': 'Exercising',
      'يطبخ': 'Cooking',
      'يتسوق': 'Shopping',
      'يسترخي': 'Relaxing',
      'يصلي': 'Praying',
      'يرسم': 'Drawing',
      'يكتب': 'Writing',
      'يصور': 'Taking photos',
      'يبرمج': 'Coding',
      'ينام': 'Sleeping'
    },
    hobbies: {
      'كرة القدم': 'Football',
      'القراءة': 'Reading',
      'السفر': 'Travel',
      'ألعاب الفيديو': 'Gaming',
      'الموسيقى': 'Music',
      'الطبخ': 'Cooking',
      'التصوير': 'Photography',
      'البرمجة': 'Coding',
      'الرسم': 'Drawing',
      'الجيم': 'Gym',
      'السباحة': 'Swimming',
      'مشاهدة الأفلام': 'Movies',
      'الكتابة': 'Writing',
      'التسوق': 'Shopping',
      'التخييم': 'Camping',
      'صيد السمك': 'Fishing',
      'الشطرنج': 'Chess',
      'السيارات': 'Cars',
      'ركوب الدراجات': 'Cycling',
      'التأمل': 'Meditation',
      'الزراعة': 'Gardening',
      'تربية الحيوانات': 'Pets',
      'التصميم': 'Design',
      'عشاق القهوة': 'Coffee',
      'التاريخ': 'History',
      'العلوم': 'Science',
      'التقنية': 'Tech',
      'الجري': 'Running',
      'اليوغا': 'Yoga',
      'الرقص': 'Dancing',
      'الغناء': 'Singing',
      'العمل التطوعي': 'Volunteering',
      'الموضة': 'Fashion',
      'المكياج': 'Makeup',
      'الأنمي': 'Anime',
      'البلياردو': 'Billiards',
      'التنس': 'Tennis',
      'كرة السلة': 'Basketball'
    },
    job_titles: {
      'مهندس برمجيات': 'Software Engineer',
      'مطور ويب': 'Web Developer',
      'مطور تطبيقات جوال': 'Mobile App Developer',
      'مدير مشروع تقني': 'Technical Project Manager',
      'مصمم جرافيك': 'Graphic Designer',
      'مصمم واجهات مستخدم (UI/UX)': 'UI/UX Designer',
      'محلل بيانات': 'Data Analyst',
      'مهندس أمن سيبراني': 'Cyber Security Engineer',
      'مسؤول شبكات': 'Network Administrator',
      'محاسب': 'Accountant',
      'مدير موارد بشرية': 'HR Manager',
      'مسوق إلكتروني': 'Digital Marketer',
      'مدير مبيعات': 'Sales Manager',
      'مندوب مبيعات': 'Sales Representative',
      'خدمة عملاء': 'Customer Service',
      'سكرتير': 'Secretary',
      'موظف استقبال': 'Receptionist',
      'مدير عام': 'General Manager',
      'رائد أعمال': 'Entrepreneur',
      'محلل مالي': 'Financial Analyst',
      'طبيب بشري': 'Physician',
      'طبيب أسنان': 'Dentist',
      'صيدلي': 'Pharmacist',
      'ممرض': 'Nurse',
      'أخصائي علاج طبيعي': 'Physical Therapist',
      'أخصائي تغذية': 'Nutritionist',
      'فني مختبر': 'Lab Technician',
      'طبيب بيطري': 'Veterinarian',
      'مهندس مدني': 'Civil Engineer',
      'مهندس معماري': 'Architect',
      'مهندس ميكانيكا': 'Mechanical Engineer',
      'مهندس كهرباء': 'Electrical Engineer',
      'مهندس زراعي': 'Agricultural Engineer',
      'مهندس ديكور': 'Interior Designer',
      'مدرس': 'Teacher',
      'أستاذ جامعي': 'University Professor',
      'معيد': 'Teaching Assistant',
      'مدير مدرسة': 'School Principal',
      'محاضر': 'Lecturer',
      'باحث أكاديمي': 'Academic Researcher',
      'محامي': 'Lawyer',
      'مستشار قانوني': 'Legal Advisor',
      'قاضي': 'Judge',
      'كاتب محتوى': 'Content Writer',
      'صحفي': 'Journalist',
      'مترجم': 'Translator',
      'مصور': 'Photographer',
      'مخرج': 'Director',
      'مونتير': 'Film Editor',
      'ممثل': 'Actor',
      'رسام': 'Painter',
      'طباخ': 'Cook',
      'شيف': 'Chef',
      'نادل': 'Waiter',
      'سائق': 'Driver',
      'ميكانيكي': 'Mechanic',
      'كهربائي منازل': 'Electrician',
      'نجار': 'Carpenter',
      'سباك': 'Plumber',
      'حداد': 'Blacksmith',
      'نقاش': 'Painter (House)',
      'حلاق': 'Barber',
      'خياط': 'Tailor',
      'طالب': 'Student',
      'عمل حر (Freelancer)': 'Freelancer',
      'مدرب رياضي': 'Sports Coach',
      'ضابط شرطة': 'Police Officer',
      'طيار': 'Pilot',
      'مضيف طيران': 'Flight Attendant'
    },
    degrees: {
      'ثانوية عامة': 'High School',
      'دبلوم فني': 'Technical Diploma',
      'دبلوم عالي': 'Higher Diploma',
      'بكالوريوس': 'Bachelor\'s Degree',
      'ليسانس': 'Licentiate',
      'ماجستير': 'Master\'s Degree',
      'دكتوراه': 'PhD',
      'زمالة': 'Fellowship'
    },
    languages_list: {
      'العربية': 'Arabic',
      'الإنجليزية': 'English',
      'الفرنسية': 'French',
      'الإسبانية': 'Spanish',
      'الألمانية': 'German',
      'الإيطالية': 'Italian',
      'التركية': 'Turkish',
      'الروسية': 'Russian',
      'الصينية': 'Chinese',
      'اليابانية': 'Japanese',
      'الكورية': 'Korean',
      'الهندية': 'Hindi',
      'البرتغالية': 'Portuguese',
      'الهولندية': 'Dutch',
      'اليونانية': 'Greek',
      'السويدية': 'Swedish',
      'الفارسية': 'Persian',
      'الأردية': 'Urdu'
    },
    months: {
      'يناير': 'January',
      'فبراير': 'February',
      'مارس': 'March',
      'أبريل': 'April',
      'مايو': 'May',
      'يونيو': 'June',
      'يوليو': 'July',
      'أغسطس': 'August',
      'سبتمبر': 'September',
      'أكتوبر': 'October',
      'نوفمبر': 'November',
      'ديسمبر': 'December'
    },
    chat_themes: {
      'افتراضي': 'Default',
      'محيط': 'Ocean',
      'حب': 'Love',
      'صداقة': 'Friendship',
      'هدوء': 'Tranquility',
      'غروب': 'Sunset',
      'توت': 'Berry',
      'غابة': 'Forest',
      'ليلي': 'Midnight',
      'مجرة': 'Galaxy',
      'صبغ': 'Tie Dye',
      'أرض': 'Earth'
    },
    emoji_categories: {
      'ابتسامات': 'Smileys',
      'حيوانات': 'Animals',
      'طعام': 'Food',
      'أنشطة': 'Activities',
      'سفر': 'Travel',
      'أشياء': 'Objects',
      'أعلام': 'Flags'
    },
    reactions: {
      'إعجاب': 'Like',
      'أحببته': 'Love',
      'أدعمك': 'Care',
      'هاها': 'Haha',
      'واو': 'Wow',
      'أحزنني': 'Sad',
      'أغضبني': 'Angry'
    },
    report_reasons: {
      'محتوى غير لائق': 'Inappropriate Content',
      'عنف أو مشاهد دموية': 'Violence or Graphic Content',
      'خطاب كراهية': 'Hate Speech',
      'معلومات مضللة': 'Misinformation',
      'سبام أو احتيال': 'Spam or Scam',
      'مضايقة': 'Harassment',
      'إساءة': 'Abuse',
      'خداع أو احتيال': 'Deception or Fraud',
      'انتحال شخصية شخص آخر': 'Impersonation',
    },
    group_rules: {
      'احترم جميع المتابعين ولا تستخدم ألفاظاً نابية': 'Respect all members and do not use offensive language.',
      'يمنع نشر المحتوى الإعلاني أو السبام': 'Advertising or spam content is not allowed.',
      'احرص أن تكون المنشورات ذات صلة بموضوع الصفحة': 'Ensure that posts are relevant to the page topic.',
      'يمنع نشر المعلومات الشخصية للآخرين': 'Publishing personal information of others is prohibited.'
    },
    cities: {
      // Egypt
      'القاهرة': 'Cairo',
      'الإسكندرية': 'Alexandria',
      'الجيزة': 'Giza',
      'المنصورة': 'Mansoura',
      'شرم الشيخ': 'Sharm El Sheikh',
      'أسوان': 'Aswan',
      'الأقصر': 'Luxor',
      'طنطا': 'Tanta',
      'بورسعيد': 'Port Said',
      'السويس': 'Suez',
      'الغردقة': 'Hurghada',
      'دمياط': 'Damietta',
      'الإسماعيلية': 'Ismailia',
      'الزقازيق': 'Zagazig',
      'المنيا': 'Minya',
      'أسيوط': 'Assiut',
      'سوهاج': 'Sohag',
      'كفر الشيخ': 'Kafr El Sheikh',
      'الفيوم': 'Faiyum',
      'بني سويف': 'Beni Suef',
      'قنا': 'Qena',
      'مطروح': 'Matrouh',
      'العريش': 'Arish',
      'شبرا الخيمة': 'Shubra El Kheima',
      'المحلة الكبرى': 'El Mahalla El Kubra',
      'دمنهور': 'Damanhour',
      '6 أكتوبر': '6th of October',
      'شبين الكوم': 'Shebin El Kom',
      'بنها': 'Banha',
      'ملوي': 'Mallawi',
      'العشر من رمضان': '10th of Ramadan',
      'بلبيس': 'Belbeis',
      'مرسى مطروح': 'Marsa Matruh',
      'إدفو': 'Edfu',
      'ميت غمر': 'Mit Ghamr',
      'الحوامدية': 'Hawamdia',
      'دسوق': 'Desouk',
      'قليوب': 'Qalyub',
      'أبو كبير': 'Abu Kabir',
      'كفر الدوار': 'Kafr El Dawar',
      'جرجا': 'Girga',
      'أخميم': 'Akhmim',
      'المطرية': 'Matareya',

      // Saudi Arabia
      'الرياض': 'Riyadh',
      'جدة': 'Jeddah',
      'مكة المكرمة': 'Mecca',
      'الدمام': 'Dammam',
      'المدينة المنورة': 'Medina',
      'الخبر': 'Khobar',
      'تبوك': 'Tabuk',
      'أبها': 'Abha',
      'الطائف': 'Taif',
      'بريدة': 'Buraydah',
      'خميس مشيط': 'Khamis Mushait',
      'الجبيل': 'Jubail',
      'حائل': 'Hail',
      'نجران': 'Najran',
      'جازان': 'Jazan',
      'الهفوف': 'Al Hofuf',
      'المبرز': 'Al Mubarraz',
      'القطيف': 'Qatif',
      'ينبع': 'Yanbu',
      'عرعر': 'Arar',
      'سكاكا': 'Sakaka',
      'الظهران': 'Dhahran',
      'الباحة': 'Al Bahah',
      'حفر الباطن': 'Hafar Al-Batin',
      'الخرج': 'Al-Kharj',
      'الثقبة': 'Thuqbah',
      'الرس': 'Ar Rass',
      'بيشة': 'Bisha',

      // UAE
      'دبي': 'Dubai',
      'أبو ظبي': 'Abu Dhabi',
      'الشارقة': 'Sharjah',
      'عجمان': 'Ajman',
      'رأس الخيمة': 'Ras Al Khaimah',
      'الفجيرة': 'Fujairah',
      'العين': 'Al Ain',
      'أم القيوين': 'Umm Al Quwain',
      'خورفكان': 'Khor Fakkan',
      'دبا الفجيرة': 'Dibba Al-Fujairah',
      'جبل علي': 'Jebel Ali',
      'مدينة زايد': 'Madinat Zayed',
      'الرويس': 'Ruwais',
      'ليوا': 'Liwa',
      'الذيد': 'Dhaid',
      'الغويفات': 'Ghuwaifat',

      // Kuwait
      'مدينة الكويت': 'Kuwait City',
      'حولي': 'Hawalli',
      'السالمية': 'Salmiya',
      'الأحمدي': 'Al Ahmadi',
      'الجهراء': 'Al Jahra',
      'الفروانية': 'Farwaniya',
      'مبارك الكبير': 'Mubarak Al-Kabeer',
      'الصباحية': 'Sabah Al Salem',
      'الفحيحيل': 'Fahaheel',

      // Qatar
      "الدوحة": "Doha",
      "الريان": "Al Rayyan",
      "الخور": "Al Khor",
      "الوكرة": "Al Wakrah",
      "أم صلال": "Umm Salal",
      "الشمال": "Ash Shamal",
      "مسيعيد": "Mesaieed",
      "دخان": "Dukhan",

     // Bahrain
      "المنامة": "Manama",
      "المحرق": "Muharraq",
      "الرفاع": "Riffa",
      "مدينة حمد": "Hamad Town",
      "مدينة عيسى": "Isa Town",
      "الحد": "Al Hidd",
      "سترة": "Sitrah",
      "البديع": "Budaiya",

     // Oman
      "مسقط": "Muscat",
      "صلالة": "Salalah",
      "صحار": "Sohar",
      "نزوى": "Nizwa",
      "صور": "Sur",
      "البريمي": "Al Buraimi",
      "السيب": "Seeb",
      "عبري": "Ibri",
      "إبراء": "Ibra",
      "خصب": "Khasab",

     // Jordan
      "عمان": "Amman",
      "الزرقاء": "Zarqa",
      "إربد": "Irbid",
      "العقبة": "Aqaba",
      "السلط": "Salt",
      "مادبا": "Madaba",
      "الكرك": "Karak",
      "جرش": "Jerash",
      "المفرق": "Mafraq",
      "معان": "Ma'an",
      "عجلون": "Ajloun",
      "الطفيلة": "Tafilah",

     // Lebanon
      "بيروت": "Beirut",
      "طرابلس": "Tripoli",
      "صيدا": "Sidon",
      "صور": "Tyre",
      "جونيه": "Jounieh",
      "زحلة": "Zahlé",
      "بعلبك": "Baalbek",
      "جبيل": "Byblos",
      "النبطية": "Nabatieh",
      "عاليه": "Aley",

     // Iraq
      "بغداد": "Baghdad",
      "البصرة": "Basra",
      "الموصل": "Mosul",
      "أربيل": "Erbil",
      "النجف": "Najaf",
      "كربلاء": "Karbala",
      "كركوك": "Kirkuk",
      "السليمانية": "Sulaymaniyah",
      "الرمادي": "Ramadi",
      "الفلوجة": "Fallujah",
      "الحلة": "Hillah",
      "الناصرية": "Nasiriyah",
      "العمارة": "Amarah",
      "الديوانية": "Diwaniyah",
      "الكوت": "Kut",
      "دهوك": "Dohuk",
      "سامراء": "Samarra",

     // Syria
      "دمشق": "Damascus",
      "حلب": "Aleppo",
      "حمص": "Homs",
      "اللاذقية": "Latakia",
      "حماة": "Hama",
      "طرطوس": "Tartus",
      "الرقة": "Raqqa",
      "دير الزور": "Deir ez-Zor",
      "الحسكة": "Hasakah",
      "إدلب": "Idlib",
      "درعا": "Daraa",
      "السويداء": "Sweida",

     // Palestine
      "القدس": "Jerusalem",
      "غزة": "Gaza",
      "رام الله": "Ramallah",
      "نابلس": "Nablus",
      "الخليل": "Hebron",
      "بيت لحم": "Bethlehem",
      "أريحا": "Jericho",
      "جنين": "Jenin",
      "طولكرم": "Tulkarm",
      "رفح": "Rafah",
      "خان يونس": "Khan Yunis",
      "قلقيلية": "Qalqilya",
      "دير البلح": "Deir al-Balah",

     // Morocco
      "الدار البيضاء": "Casablanca",
      "الرباط": "Rabat",
      "مراكش": "Marrakesh",
      "فاس": "Fes",
      "طنجة": "Tangier",
      "أكادير": "Agadir",
      "مكناس": "Meknes",
      "وجدة": "Oujda",
      "القنيطرة": "Kenitra",
      "تطوان": "Tetouan",
      "آسفي": "Safi",
      "تمارة": "Temara",
      "العيون": "Laayoune",
      "المحمدية": "Mohammedia",
      "الجديدة": "El Jadida",
      "بني ملال": "Beni Mellal",

     // Tunisia
      "تونس": "Tunis",
      "صفاقس": "Sfax",
      "سوسة": "Sousse",
      "المنستير": "Monastir",
      "القيروان": "Kairouan",
      "بنزرت": "Bizerte",
      "قابس": "Gabès",
      "أريانة": "Ariana",
      "القصرين": "Kasserine",
      "قفصة": "Gafsa",
      "توزر": "Tozeur",
      "جربة": "Djerba",

     // Algeria
      "الجزائر": "Algiers",
      "وهران": "Oran",
      "قسنطينة": "Constantine",
      "عنابة": "Annaba",
      "البليدة": "Blida",
      "تلمسان": "Tlemcen",
      "سطيف": "Sétif",
      "باتنة": "Batna",
      "بجاية": "Béjaïa",
      "سكيكدة": "Skikda",
      "سيدي بلعباس": "Sidi Bel Abbès",
      "مستغانم": "Mostaganem",
      "بسكرة": "Biskra",

     // Libya
      "طرابلس": "Tripoli",
      "بنغازي": "Benghazi",
      "مصراتة": "Misrata",
      "البيضاء": "Al Bayda",
      "طبرق": "Tobruk",
      "الزاوية": "Zawiya",
      "سبها": "Sabha",
      "سرت": "Sirte",
      "أجدابيا": "Ajdabiya",
      "درنة": "Derna",

     // Sudan
      "الخرطوم": "Khartoum",
      "أم درمان": "Omdurman",
      "بورتسودان": "Port Sudan",
      "نيالا": "Nyala",
      "كسلا": "Kassala",
      "الأبيض": "El Obeid",
      "القضارف": "Gedaref",
      "كوستي": "Kosti",
      "واد مدني": "Wad Madani",

     // Yemen
      "صنعاء": "Sana'a",
      "عدن": "Aden",
      "تعز": "Taiz",
      "الحديدة": "Al Hudaydah",
      "المكلا": "Mukalla",
      "إب": "Ibb",
      "ذمار": "Dhamar",
      "عمران": "Amran",
      "صعدة": "Saada",

     // Mauritania
      "نواكشوط": "Nouakchott",
      "نواذيبو": "Nouadhibou",
      "كيفه": "Kiffa",
      "روصو": "Rosso",
      "كيهيدي": "Kaédi",

     // Somalia
      "مقديشو": "Mogadishu",
      "هرجيسا": "Hargeisa",
      "بوصاصو": "Bosaso",
      "جالكعيو": "Galkayo",
      "بربرة": "Berbera",

     // Djibouti
      "جيبوتي": "Djibouti",
      "علي صبيح": "Ali Sabieh",
      "تاجورة": "Tadjoura",
      "دخيل": "Dikhil",

     // Comoros
      "موروني": "Moroni",
      "موتسامودو": "Mutsamudu",
      "فومبوني": "Fomboni",

     // Turkey
      "إسطنبول": "Istanbul",
      "أنقرة": "Ankara",
      "إزمير": "Izmir",
      "أنطاليا": "Antalya",
      "بورصة": "Bursa",
      "غازي عنتاب": "Gaziantep",
      "أضنة": "Adana",
      "قونية": "Konya",
      "مرسين": "Mersin",
      "ديار بكر": "Diyarbakr",
      "قيصري": "Kayseri",
      "سامسون": "Samsun",

     // United States
      "نيويورك": "New York",
      "لوس أنجلوس": "Los Angeles",
      "شيكاغو": "Chicago",
      "هيوستن": "Houston",
      "واشنطن": "Washington",
      "ميامي": "Miami",
      "سان فرانسيسكو": "San Francisco",
      "بوسطن": "Boston",
      "سياتل": "Seattle",
      "دالاس": "Dallas",
      "أتلانتا": "Atlanta",
      "فيلادلفيا": "Philadelphia",
      "فينيكس": "Phoenix",
      "ديترويت": "Detroit",
      "سان دييغو": "San Diego",
      
     // United Kingdom
      "لندن": "London",
      "مانشستر": "Manchester",
      "ليفربول": "Liverpool",
      "برمنغهام": "Birmingham",
      "ليدز": "Leeds",
      "غلاسكو": "Glasgow",
      "أدنبرة": "Edinburgh",
      "بريستول": "Bristol",
      "شفيلد": "Sheffield",
      "كارديف": "Cardiff",
      "بلفاست": "Belfast",

     // Germany
      "برلين": "Berlin",
      "ميونخ": "Munich",
      "هامبورغ": "Hamburg",
      "فرانكفورت": "Frankfurt",
      "كولونيا": "Cologne",
      "شتوتغارت": "Stuttgart",
      "دوسلدورف": "Düsseldorf",
      "دورتموند": "Dortmund",
      "إيسن": "Essen",
      "لايبزيغ": "Leipzig",

     // France
      "باريس": "Paris",
      "ليون": "Lyon",
      "مارسيليا": "Marseille",
      "تولوز": "Toulouse",
      "نيس": "Nice",
      "بوردو": "Bordeaux",
      "ستراسبورغ": "Strasbourg",
      "نانت": "Nantes",
      "مونبلييه": "Montpellier",
      "ليل": "Lille",

     // Italy
      "روما": "Rome",
      "ميلانو": "Milan",
      "نابولي": "Naples",
      "تورينو": "Turin",
      "البندقية": "Venice",
      "فلورنسا": "Florence",
      "بولونيا": "Bologna",
      "جنوة": "Genoa",
      "باري": "Bari",
      "باليرمو": "Palermo",

     // Spain
      "مدريد": "Madrid",
      "برشلونة": "Barcelona",
      "فالنسيا": "Valencia",
      "إشبيلية": "Seville",
      "ملقة": "Málaga",
      "بلباو": "Bilbao",
      "سرقسطة": "Zaragoza",
      "مايوركا": "Mallorca",

     // Canada
      "تورونتو": "Toronto",
      "مونتريال": "Montreal",
      "فانكوفر": "Vancouver",
      "كالجاري": "Calgary",
      "أوتاوا": "Ottawa",
      "إدمونتون": "Edmonton",
      "كيبيك": "Quebec City",
      "وينيبيغ": "Winnipeg",

     // Australia
      "سيدني": "Sydney",
      "ملبورن": "Melbourne",
      "بريزبن": "Brisbane",
      "بيرث": "Perth",
      "أديلايد": "Adelaide",
      "كانبرا": "Canberra",
      "جولد كوست": "Gold Coast",

     // India
      "نيودلهي": "New Delhi",
      "مومباي": "Mumbai",
      "بنغالور": "Bengaluru",
      "تشيناي": "Chennai",
      "حيدر أباد": "Hyderabad",
      "كولكاتا": "Kolkata",
      "أحمد أباد": "Ahmedabad",
      "بونه": "Pune",

     // China
      "بكين": "Beijing",
      "شانغهاي": "Shanghai",
      "غوانزو": "Guangzhou",
      "شنتشن": "Shenzhen",
      "تشنغدو": "Chengdu",
      "ووهان": "Wuhan",
      "تيانجين": "Tianjin",
      "هانغتشو": "Hangzhou",

     // Japan
      "طوكيو": "Tokyo",
      "أوساكا": "Osaka",
      "يوكوهاما": "Yokohama",
      "ناغويا": "Nagoya",
      "سوبورو": "Sapporo",
      "كيوتو": "Kyoto",
      "كوبي": "Kobe",
      "فوكوكا": "Fukuoka",

     // Brazil
      "ساو باولو": "São Paulo",
      "ريو دي جانيرو": "Rio de Janeiro",
      "برازيليا": "Brasília",
      "سلفادور": "Salvador",
      "فورتاليزا": "Fortaleza",
      "بيلو هوريزونتي": "Belo Horizonte",

     // Russia
      "موسكو": "Moscow",
      "سانت بطرسبرغ": "Saint Petersburg",
      "نوفوسيبيرسك": "Novosibirsk",
      "يكاترينبورغ": "Yekaterinburg",
      "قازان": "Kazan",
      "نيجني نوفغورود": "Nizhny Novgorod"

      // ... Add mappings for all other major cities referenced in data files as needed
      'الدوحة': 'Doha',
      'المنامة': 'Manama',
      'مسقط': 'Muscat',
      'عمان': 'Amman',
      'بيروت': 'Beirut',
      'بغداد': 'Baghdad',
      'الجزائر': 'Algiers',
      'تونس': 'Tunis',
      'الرباط': 'Rabat',
      'الدار البيضاء': 'Casablanca',                              
      'نيويورك': 'New York',
      'لندن': 'London',
      'باريس': 'Paris',
      'برلين': 'Berlin',
      'إسطنبول': 'Istanbul'
    }
  }
};