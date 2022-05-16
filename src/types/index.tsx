export interface Coupon {
    id: string,
    name: string,
    discount: string,
    type: string,
    used: boolean,
    createAt: Date,
    updateAt: Date,
}

export interface Offer {
    id: string,
    name: string,
    shortDescription: string,
    description: string,
    createAt: Date,
    updateAt: Date,
}

export interface Restaurant {
    id: string,
    name: string,
    logoLink: string,
    imageLink: string,
    reservationLink: string,
    generalCoupon: boolean,
    uniqueCoupon: boolean,
    type: string,
    coupons: [Coupon],
    offers: [Offer],
    createAt: Date,
    updateAt: Date,
}