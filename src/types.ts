export interface TenderValue {
  amount: number
  currency: string
  valueAddedTaxIncluded: boolean
}

export interface TenderPeriod {
  startDate?: string
  endDate?: string
}

export interface ProcuringEntity {
  name: string
  identifier: {
    id: string
    scheme: string
    legalName?: string
  }
}

export interface Tender {
  id: string
  tenderID: string
  title: string
  status: string
  value?: TenderValue
  tenderPeriod?: TenderPeriod
  procuringEntity: ProcuringEntity
  dateModified: string
}

export interface TenderListItem {
  id: string
  tenderID: string
  status: string
  procuringEntity: ProcuringEntity
  tenderPeriod?: TenderPeriod
  dateModified: string
}

export interface ApiListResponse {
  data: TenderListItem[]
  next_page?: {
    offset: string
    uri: string
  }
}

export interface ApiTenderResponse {
  data: Tender
}
