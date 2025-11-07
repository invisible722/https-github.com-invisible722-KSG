export interface BusinessCardData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
}

export enum IndustryGroup {
  TECHNICAL_CONSULTING_SERVICES = 'Tư vấn và dịch vụ kỹ thuật',
  NEW_MATERIALS_TECHNOLOGY = 'Vật liệu và công nghệ mới',
  CONSTRUCTION_MANUFACTURING = 'Thi công và sản xuất',
  OTHER = 'Khác',
}
