interface QrisParse {
  PayloadFormatIndicator: string
  PointOfInitiationMethod: string
  QRISIssuer: string
  QRISGlobalMerchantID: string
  QRISAcquirerMerchantID: string
  MerchantBusinessType: string
  MerchantCategoryCode: string
  TransactionCurrency: string
  CountryCode: string
  MerchantName: string
  MerchantCity: string
  PostalCode: string
  CRC: string
}

const qrisParse = (str: string): QrisParse => {
  let tags = {
    CountryCode: '',
    CRC: '',
    MerchantBusinessType: '',
    MerchantCategoryCode: '',
    MerchantCity: '',
    MerchantName: '',
    PayloadFormatIndicator: '',
    PointOfInitiationMethod: '',
    PostalCode: '',
    QRISAcquirerMerchantID: '',
    QRISGlobalMerchantID: '',
    QRISIssuer: '',
    TransactionCurrency: ''
  }

  const emvTags: { [key: string]: any } = {
    '00': {
      id: '00',
      name: 'PayloadFormatIndicator',
      format: 'N',
      presence: 'M'
    },
    '01': {
      id: '01',
      name: 'PointOfInitiationMethod',
      format: 'N',
      presence: 'O'
    },
    '52': {
      id: '52',
      name: 'MerchantCategoryCode',
      format: 'N',
      presence: 'M'
    },
    '53': {
      id: '53',
      name: 'TransactionCurrency',
      format: 'N',
      presence: 'M'
    },
    '54': {
      id: '54',
      name: 'TransactionAmount',
      format: 'ans',
      presence: 'C'
    },
    '58': {
      id: '58',
      name: 'CountryCode',
      format: 'ans',
      presence: 'M'
    },
    '59': {
      id: '59',
      name: 'MerchantName',
      format: 'ans',
      presence: 'M'
    },
    '60': {
      id: '60',
      name: 'MerchantCity',
      format: 'ans',
      presence: 'M'
    },
    '61': {
      id: '61',
      name: 'PostalCode',
      format: 'ans',
      presence: 'O'
    },
    '63': {
      id: '63',
      name: 'CRC',
      format: 'ans',
      presence: 'M',
      valid: true // check that it valid CRC
    }
  }

  const _parseTag = (emvdata: string) => {
    let index = 0

    while (index < emvdata.length) {
      const data = emvdata.substring(index)
      const tagId = data.substr(0, 2)
      const tagLength = parseInt(data.substr(2, 2))
      const tagInformation = data.substr(4, tagLength)

      if (tagId === '26') {
        qris26Parse(tagInformation)
      }

      if (tagId === '51') {
        // still nothing
      }

      if (tagId in emvTags) {
        const key = emvTags[tagId].name
        tags = {
          ...tags,
          [key]: tagInformation
        }
      }

      index += tagLength + 4
    }
    return tags
  }

  const qris26Parse = (qrisdata: string) => {
    let index = 0

    while (index < qrisdata.length) {
      const data = qrisdata.substring(index)
      const tagId = data.substr(0, 2)
      const tagLength = parseInt(data.substr(2, 2))
      const tagInformation = data.substr(4, tagLength)

      if (tagId === '00') {
        tags.QRISIssuer = tagInformation
      }

      if (tagId === '01') {
        tags.QRISGlobalMerchantID = tagInformation
      }

      if (tagId === '02') {
        tags.QRISAcquirerMerchantID = tagInformation
      }

      if (tagId === '03') {
        tags.MerchantBusinessType = tagInformation
      }

      index += tagLength + 4
    }

    return tags
  }

  return _parseTag(str)
}


console.log(qrisParse('00020101021126640017ID.CO.BANKBSI.WWW0118936004510000080974021000009127860303UMI51440014ID.CO.QRIS.WWW0215ID20221485322620303UMI5204839853033605802ID5919BARKASMAL NUSANTARA6006SLEMAN61055528162070703A0163043C29'))
