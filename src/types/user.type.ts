export enum Role {
    test = 'test',
    user = 'user',
    manager = 'manager',
    owner = 'owner',
}

export enum Position {
    juniorFront = 'Junior Front-end Developer',
    midFront = 'Mid Front-end Developer',
    seniorFront = 'Senior Front-end Developer',
    juniorBack = 'Junior Back-end Developer',
    midBack = 'Mid Back-end Developer',
    seniorBack = 'Senior Back-end Developer',
    juniorTest = 'Junior Tester',
    midTest = 'Mid Tester',
    seniorTest = 'Senior Tester',
    pm = 'Project Manager',
    director = 'Director',
    sm = 'Scrum Master',
    juniorGraphic = 'Junior Graphic Designer',
    midGraphic = 'Mid Graphic Desinger',
    seniorGraphic = 'Senior Graphic Desinger',
    adminAssit = 'Administrative Assitant',
    juniorSales = 'Junior Sales Specialist',
    midSales = 'Sales Specialist',
    seniorSales = 'Senior Sales Specialist',
    brandManager = 'Brand Manager',
    marketingManager = 'Marketing Manager',
    socialManager = 'Social Media Manager',
}



export type ChangePasswordResponse = { ok: boolean}