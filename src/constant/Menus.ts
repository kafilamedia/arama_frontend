
import { AuthorityType } from '../models/AuthorityType';
import Menu from '../models/settings/Menu';
 

export const getMenus = () => {
    let menuSet: Menu[] = [];
    for (let i = 0; i < _menus.length; i++) {
        const element: Menu = _menus[i];
        const menu:Menu = Object.assign(new Menu, element);
        const subMenus:Menu[] = [];
        if (element.subMenus) {
            for (let i = 0; i < element.subMenus.length; i++) {
                const subMenu = element.subMenus[i];
                subMenus.push(Object.assign(new Menu, subMenu));
            }
            menu.subMenus = subMenus;
        }
        menuSet.push(menu);
    }
    
    return menuSet;
}
export const extractMenuPath = (pathName: string) => {
    const pathRaw = pathName.split('/');
   
    let firstPath = pathRaw[0];
    if (firstPath.trim() == "") {
        firstPath = pathRaw[1];
    }
    return firstPath;
}
export const getMenuByMenuPath = (pathName: string): Menu | null => {
    const menus = getMenus();
    try {
        for (let i = 0; i < menus.length; i++) {
            const menu: Menu = menus[i];
            if (menu.url == "/" + pathName) {
                return menu;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

const _menus: Menu[] = [
    {
        code: 'home',
        name: "Home",
        url: "/home",
        menuClass: "fa fa-home",
        active: false,
        authenticated: false,
        showSidebar: false,
        role : []
    },
    
    {
        code: 'dashboard',
        name: "Dashboard",
        url: "/dashboard",
        menuClass: "fas fa-tachometer-alt",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [AuthorityType.admin_asrama, AuthorityType.musyrif_asrama],
        subMenus: [
            {
                code: 'menu1',
                name: 'Menu #1',
                url: 'menu1',
                menuClass: 'fas fa-history',
                role: [AuthorityType.admin_asrama, AuthorityType.musyrif_asrama],
            },
            // {
            //     code: 'dashboard_productsales',
            //     name: 'Product Sales',
            //     url: 'productsales',
            //     menuClass: 'fas fa-chart-line',
            //     role: [],
            // }
        ]
    }, 
    {
        code: 'management',
        name: "Management",
        url: "/management",
        menuClass: "fas fa-mail-bulk",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [AuthorityType.admin_asrama],
        subMenus: [
            {
                code: 'musyrifmanagement',
                name: 'Musyrif Management',
                url: 'musyrifmanagement',
                menuClass: 'fas fa-users',
                role: [AuthorityType.admin_asrama],
            },
            {
                code: 'rule_category',
                name: 'Rule Category',
                url: 'rule_category',
                menuClass: 'fas fa-tags',
                role: [AuthorityType.admin_asrama],
            },
            {
                code: 'rule_point',
                name: 'Rule Point',
                url: 'rule_point',
                menuClass: 'fas fa-puzzle-piece',
                role: [AuthorityType.admin_asrama],
            },
            // {
            //     code: 'dashboard_productsales',
            //     name: 'Product Sales',
            //     url: 'productsales',
            //     menuClass: 'fas fa-chart-line',
            //     role: [],
            // }
        ]
    }, 
    {
        code: 'dormitoryactivity',
        name: "Dormitory",
        url: "/dormitoryactivity",
        menuClass: "fas fa-school",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [  AuthorityType.musyrif_asrama],
        subMenus: [
            {
                code: 'studentlist',
                name: 'Student List',
                url: 'studentlist',
                menuClass: 'fas fa-users',
                role: [ AuthorityType.musyrif_asrama],
            },
            {
                code: 'input_point',
                name: 'Input Point',
                url: 'inputpoint',
                menuClass: 'fas fa-pen-square',
                role: [ AuthorityType.musyrif_asrama],
            },
            {
                code: 'medicalrecord',
                name: 'Medical Record',
                url: 'medicalrecord',
                menuClass: 'fas fa-briefcase-medical',
                role: [ AuthorityType.musyrif_asrama],
            },
            {
                code: 'pointsummary',
                name: 'Summary Point',
                url: 'pointsummary',
                menuClass: 'fas fa-clipboard',
                role: [ AuthorityType.musyrif_asrama],
            },
           
            // {
            //     code: 'dashboard_productsales',
            //     name: 'Product Sales',
            //     url: 'productsales',
            //     menuClass: 'fas fa-chart-line',
            //     role: [],
            // }
        ]
    }, 
    {
        code: 'settings',
        name: "Setting",
        url: "/settings",
        menuClass: "fas fa-cogs",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [AuthorityType.admin_asrama ,AuthorityType.musyrif_asrama],
        subMenus: [
            {
                code: 'user_profile',
                name: 'Profile',
                menuClass: 'fas fa-user-cog',
                url: 'user-profile',
                role: [AuthorityType.admin_asrama, AuthorityType.musyrif_asrama],
            },
            {
                code: 'app_profile',
                name: 'Application Setting',
                menuClass: 'fas fa-cog',
                url: 'app-profile',
                role: [AuthorityType.admin_asrama ],
            },
            
        ]
    },
];
