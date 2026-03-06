<template>
    <div id="dhlreturns" v-bind:class="{busy: busy}">
        <div id="busycover"></div>
        <form action="" method="POST" class="container" v-on:submit="makeLabel">
            <fieldset>
                <legend>{{ txt.returns_sender}}</legend>
                <div class="row">
                    <div class="col-3">
                        {{ txt.name1 }}
                    </div>
                    <div class="col">
                        <input type="text" name="name1" maxlength="35" v-model="returnOrder.senderAddress.name1" required>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        {{ txt.name2 }}
                    </div>
                    <div class="col">
                        <input type="text" name="name2" maxlength="35" v-model="returnOrder.senderAddress.name2">
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        {{ txt.name3 }}
                    </div>
                    <div class="col">
                        <input type="text" name="name3" maxlength="35" v-model="returnOrder.senderAddress.name3">
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        {{ txt.street_name }}
                    </div>
                    <div class="col">
                        <input type="text" name="streetName" maxlength="35" v-model="returnOrder.senderAddress.streetName"
                               required>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        {{ txt.house_number }}
                    </div>
                    <div class="col">
                        <input type="text" name="houseNumber" maxlength="5" v-model="returnOrder.senderAddress.houseNumber"
                               required>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        {{ txt.postcode }}
                    </div>
                    <div class="col">
                        <input type="text" name="postCode" maxlength="10" v-model="returnOrder.senderAddress.postCode"
                               required>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        {{ txt.city }}
                    </div>
                    <div class="col">
                        <input type="text" name="city" maxlength="35" v-model="returnOrder.senderAddress.city" required>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        {{ txt.country }}
                    </div>
                    <div class="col">
                        <select name="country" v-model="returnOrder.senderAddress.country">
                            <option v-for="country in dhlcountries" :value="country.iso3">{{ country.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        {{ txt.customer_reference }}
                    </div>
                    <div class="col">
                        <input type="text" name="customerReference" maxlength="30" v-model="returnOrder.customerReference">
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        {{ txt.shipment_reference }}
                    </div>
                    <div class="col">
                        <input type="text" name="shipmentReference" maxlength="30" v-model="returnOrder.shipmentReference">
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        {{ txt.weight_in_grams }}
                    </div>
                    <div class="col">
                        <input type="number" name="weightInGrams" min="0" v-model="returnOrder.weightInGrams">
                    </div>
                </div>
                <div class="row">
                    <div class="col-3">
                        {{ txt.value }}
                    </div>
                    <div class="col">
                        <input type="number" name="value" step="0.01" v-model="returnOrder.value">
                    </div>
                </div>
            </fieldset>

            <fieldset v-if="returnOrder.senderAddress.country === 'CHE' || returnOrder.senderAddress.country === 'GBR'">
                <legend>{{ txt.customs_declaration }}</legend>
                <div class="cn23">
                    <div class="row customs">
                        <div class="col-3">
                            {{ txt.customs_currency }}
                        </div>
                        <div class="col">
                            <input type="text" name="customsDocumentCurrency" maxlength="3"
                                   v-model="returnOrder.customsDocument.currency">
                        </div>
                    </div>
                    <div class="row customs">
                        <div class="col-3">
                            {{ txt.customs_original_shipment_number }}
                        </div>
                        <div class="col">
                            <input type="text" name="customsDocumentOriginalShipmentNumber"
                                   v-model="returnOrder.customsDocument.originalShipmentNumber">
                        </div>
                    </div>
                    <div class="row customs">
                        <div class="col-3">
                            {{ txt.customs_original_operator }}
                        </div>
                        <div class="col">
                            <input type="text" name="customsDocumentOriginalOperator"
                                   v-model="returnOrder.customsDocument.originalOperator">
                        </div>
                    </div>
                    <div class="row customs">
                        <div class="col-3">
                            {{ txt.customs_acommpanying_document }}
                        </div>
                        <div class="col">
                            <input type="text" name="customsDocumentAcommpanyingDocument"
                                   v-model="returnOrder.customsDocument.acommpanyingDocument">
                        </div>
                    </div>
                    <div class="row customs">
                        <div class="col-3">
                            {{ txt.customs_original_invoice_number }}
                        </div>
                        <div class="col">
                            <input type="text" name="customsDocumentOriginalInvoiceNumber"
                                   v-model="returnOrder.customsDocument.originalInvoiceNumber">
                        </div>
                    </div>
                    <div class="row customs">
                        <div class="col-3">
                            {{ txt.customs_original_invoice_date }}
                        </div>
                        <div class="col">
                            <input type="date" name="customsDocumentOriginalInvoiceDate"
                                   v-model="returnOrder.customsDocument.originalInvoiceDate">
                        </div>
                    </div>
                    <div class="row customs">
                        <div class="col-3">
                            {{ txt.customs_comment }}
                        </div>
                        <div class="col">
                            <input type="text" name="customsDocumentComment" v-model="returnOrder.customsDocument.comment">
                        </div>
                    </div>
                    <div class="row customs">
                        <div class="col">
                            <table>
                                <thead>
                                <tr>
                                    <th>{{ txt.customspos_description }}</th>
                                    <th>{{ txt.customspos_count }}</th>
                                    <th>{{ txt.customspos_weight }}</th>
                                    <th>{{ txt.customspos_values }}</th>
                                    <th>{{ txt.customspos_origin_country }}</th>
                                    <th>{{ txt.customspos_article_reference }}</th>
                                    <th>{{ txt.customspos_tarif_number }}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type="text" maxlength="50" name="customsPosition1Description"
                                               v-model="returnOrder.customsDocument.positions[0].positionDescription">
                                    </td>
                                    <td>
                                        <input type="number" min="0" name="customsPosition1Count"
                                               v-model="returnOrder.customsDocument.positions[0].count">
                                    </td>
                                    <td>
                                        <input type="number" min="0" max="99999" name="customsPosition1WeightInGrams"
                                               v-model="returnOrder.customsDocument.positions[0].weightInGrams">
                                    </td>
                                    <td>
                                        <input type="number" min="0" step="0.01" name="customsPosition1Values"
                                               v-model="returnOrder.customsDocument.positions[0].values">
                                    </td>
                                    <td>
                                        <select name="customsPosition1OriginCountry"
                                                v-model="returnOrder.customsDocument.positions[0].originCountry">
                                            <option value="">{{ txt.country_unknown }}</option>
                                            <option v-for="country in allcountries" :value="country.iso3">{{ country.name }}
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text" maxlength="40" name="customsPosition1ArticleReference"
                                               v-model="returnOrder.customsDocument.positions[0].articleReference">
                                    </td>
                                    <td>
                                        <input type="text" maxlength="8" name="customsPosition1TarifNumber"
                                               v-model="returnOrder.customsDocument.positions[0].tarifNumber">
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="text" maxlength="50" name="customsPosition1Description"
                                               v-model="returnOrder.customsDocument.positions[1].positionDescription">
                                    </td>
                                    <td>
                                        <input type="number" min="0" name="customsPosition1Count"
                                               v-model="returnOrder.customsDocument.positions[1].count">
                                    </td>
                                    <td>
                                        <input type="number" min="0" max="99999" name="customsPosition1WeightInGrams"
                                               v-model="returnOrder.customsDocument.positions[1].weightInGrams">
                                    </td>
                                    <td>
                                        <input type="number" min="0" step="0.01" name="customsPosition1Values"
                                               v-model="returnOrder.customsDocument.positions[1].values">
                                    </td>
                                    <td>
                                        <select name="customsPosition1OriginCountry"
                                                v-model="returnOrder.customsDocument.positions[1].originCountry">
                                            <option value="">{{ txt.country_unknown }}</option>
                                            <option v-for="country in allcountries" :value="country.iso3">{{ country.name }}
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text" maxlength="40" name="customsPosition1ArticleReference"
                                               v-model="returnOrder.customsDocument.positions[1].articleReference">
                                    </td>
                                    <td>
                                        <input type="text" maxlength="8" name="customsPosition1TarifNumber"
                                               v-model="returnOrder.customsDocument.positions[1].tarifNumber">
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="text" maxlength="50" name="customsPosition1Description"
                                               v-model="returnOrder.customsDocument.positions[2].positionDescription">
                                    </td>
                                    <td>
                                        <input type="number" min="0" name="customsPosition1Count"
                                               v-model="returnOrder.customsDocument.positions[2].count">
                                    </td>
                                    <td>
                                        <input type="number" min="0" max="99999" name="customsPosition1WeightInGrams"
                                               v-model="returnOrder.customsDocument.positions[2].weightInGrams">
                                    </td>
                                    <td>
                                        <input type="number" min="0" step="0.01" name="customsPosition1Values"
                                               v-model="returnOrder.customsDocument.positions[2].values">
                                    </td>
                                    <td>
                                        <select name="customsPosition1OriginCountry"
                                                v-model="returnOrder.customsDocument.positions[2].originCountry">
                                            <option value="">{{ txt.country_unknown }}</option>
                                            <option v-for="country in allcountries" :value="country.iso3">{{ country.name }}
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text" maxlength="40" name="customsPosition1ArticleReference"
                                               v-model="returnOrder.customsDocument.positions[2].articleReference">
                                    </td>
                                    <td>
                                        <input type="text" maxlength="8" name="customsPosition1TarifNumber"
                                               v-model="returnOrder.customsDocument.positions[2].tarifNumber">
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="text" maxlength="50" name="customsPosition1Description"
                                               v-model="returnOrder.customsDocument.positions[3].positionDescription">
                                    </td>
                                    <td>
                                        <input type="number" min="0" name="customsPosition1Count"
                                               v-model="returnOrder.customsDocument.positions[3].count">
                                    </td>
                                    <td>
                                        <input type="number" min="0" max="99999" name="customsPosition1WeightInGrams"
                                               v-model="returnOrder.customsDocument.positions[3].weightInGrams">
                                    </td>
                                    <td>
                                        <input type="number" min="0" step="0.01" name="customsPosition1Values"
                                               v-model="returnOrder.customsDocument.positions[3].values">
                                    </td>
                                    <td>
                                        <select name="customsPosition1OriginCountry"
                                                v-model="returnOrder.customsDocument.positions[3].originCountry">
                                            <option value="">{{ txt.country_unknown }}</option>
                                            <option v-for="country in allcountries" :value="country.iso3">{{ country.name }}
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text" maxlength="40" name="customsPosition1ArticleReference"
                                               v-model="returnOrder.customsDocument.positions[3].articleReference">
                                    </td>
                                    <td>
                                        <input type="text" maxlength="8" name="customsPosition1TarifNumber"
                                               v-model="returnOrder.customsDocument.positions[3].tarifNumber">
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="text" maxlength="50" name="customsPosition1Description"
                                               v-model="returnOrder.customsDocument.positions[4].positionDescription">
                                    </td>
                                    <td>
                                        <input type="number" min="0" name="customsPosition1Count"
                                               v-model="returnOrder.customsDocument.positions[4].count">
                                    </td>
                                    <td>
                                        <input type="number" min="0" max="99999" name="customsPosition1WeightInGrams"
                                               v-model="returnOrder.customsDocument.positions[4].weightInGrams">
                                    </td>
                                    <td>
                                        <input type="number" min="0" step="0.01" name="customsPosition1Values"
                                               v-model="returnOrder.customsDocument.positions[4].values">
                                    </td>
                                    <td>
                                        <select name="customsPosition1OriginCountry"
                                                v-model="returnOrder.customsDocument.positions[4].originCountry">
                                            <option value="">{{ txt.country_unknown }}</option>
                                            <option v-for="country in allcountries" :value="country.iso3">{{ country.name }}
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text" maxlength="40" name="customsPosition1ArticleReference"
                                               v-model="returnOrder.customsDocument.positions[4].articleReference">
                                    </td>
                                    <td>
                                        <input type="text" maxlength="8" name="customsPosition1TarifNumber"
                                               v-model="returnOrder.customsDocument.positions[4].tarifNumber">
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </fieldset>

            <div class="row">
                <div class="col-10"></div>
                <div class="col-2 text-right">
                    <button type="submit" class="btn btn-primary">{{ txt.make_label }}</button>
                </div>
            </div>
        </form>

        <table class="table labellist container" v-if="labelList.length > 0">
            <thead>
            <tr>
                <th scope="col">{{ txt.shipment_number }}</th>
                <th scope="col">{{ txt.label_creation_date }}</th>
                <th scope="col">{{ txt.download }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="label in labelList">
                <td>{{ label.shipmentNumber }}</td>
                <td>{{ label.creationDate }}</td>
                <td>
                    <a v-bind:href="label.labelUrl" class="btn btn-secondary">Download</a>
                    <!--
                    <button
                        class="btn btn-secondary"
                        v-bind:title="customersEmailAddress"
                        v-on:click="sendByEmail($event, label.filename, customersEmailAddress)">{{ txt.send_by_email }}</button>
                        -->
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: "DhlReturns.vue",
    data() {
        return {
            txt: window.jsEnvironment.vuePage.translations,
            busy: false,
            orderId: 0,
            dhlcountries: (window as any).dhlreturns.countries_json,
            allcountries: (window as any).dhlreturns.all_countries_json,
            labelList: [],
            customersEmailAddress: '',
            returnOrder: {
                senderAddress: {
                    name1: '',
                    name2: '',
                    name3: '',
                    streetName: '',
                    houseNumber: '',
                    postCode: '',
                    city: '',
                    country: '',
                },
                customerReference: '',
                shipmentReference: '',
                email: '',
                telephoneNumber: '',
                weightInGrams: 0,
                value: 0.0,
                customsDocument: {
                    currency: '',
                    originalShipmentNumber: '',
                    originalOperator: 'DHL',
                    acommpanyingDocument: '',
                    originalInvoiceNumber: '',
                    originalInvoiceDate: '',
                    comment: '',
                    positions: [
                        {
                            positionDescription: '',
                            count: 0,
                            weightInGrams: 0,
                            values: 0.0,
                            originCountry: '',
                            articleReference: '',
                            tarifNumber: '',
                        },
                        {
                            positionDescription: '',
                            count: 0,
                            weightInGrams: 0,
                            values: 0.0,
                            originCountry: '',
                            articleReference: '',
                            tarifNumber: '',
                        },
                        {
                            positionDescription: '',
                            count: 0,
                            weightInGrams: 0,
                            values: 0.0,
                            originCountry: '',
                            articleReference: '',
                            tarifNumber: '',
                        },
                        {
                            positionDescription: '',
                            count: 0,
                            weightInGrams: 0,
                            values: 0.0,
                            originCountry: '',
                            articleReference: '',
                            tarifNumber: '',
                        },
                        {
                            positionDescription: '',
                            count: 0,
                            weightInGrams: 0,
                            values: 0.0,
                            originCountry: '',
                            articleReference: '',
                            tarifNumber: '',
                        },
                    ]
                }
            }
        };
    },
    mounted: function () {
        // initialization
        let orderId = (window as any).dhlreturns.order_id;
        console.debug('orderId: ' + orderId);
        if (typeof orderId !== 'undefined') {
            this.orderId = orderId;
            this.fetchOrderData(orderId);
            this.fetchLabelList();
        }
    },
    methods: {
        fetchOrderData: async function (orderId: string): Promise<any> {
            this.busy = true;
            console.info('fetching data for order ' + orderId);
            let url = `${window.jsEnvironment.baseUrl}/admin/dhlreturns/orderdata/` + orderId;
            let response = await window.fetch(url);
            if (!response.ok) {
                console.info('Could not retrieve order data: ' + response.status + ' / ' + response.statusText);
                throw new Error(response.statusText);
            }
            let orderData: any = await response.json();
            console.debug(orderData);
            this.customersEmailAddress = orderData.customers_email_address;
            this.returnOrder.senderAddress.name1 = orderData.deliveryAddress.name;
            this.returnOrder.senderAddress.name2 = orderData.deliveryAddress.company;
            this.returnOrder.senderAddress.streetName = orderData.deliveryAddress.street_address;
            this.returnOrder.senderAddress.houseNumber = orderData.deliveryAddress.house_number;
            this.returnOrder.senderAddress.city = orderData.deliveryAddress.city;
            this.returnOrder.senderAddress.postCode = orderData.deliveryAddress.postcode;
            this.returnOrder.senderAddress.country = orderData.deliveryAddress.country_iso_code_3;
            this.returnOrder.customerReference = orderId;
            this.returnOrder.shipmentReference = orderId;
            this.returnOrder.value = orderData.value;
            this.returnOrder.weightInGrams = orderData.weightInGrams;
            this.returnOrder.customsDocument.currency = orderData.customsDocument.currency;
            this.returnOrder.customsDocument.originalShipmentNumber = orderData.customsDocument.originalShipmentNumber;
            this.returnOrder.customsDocument.originalOperator = orderData.customsDocument.originalOperator;
            this.returnOrder.customsDocument.originalInvoiceNumber = orderData.customsDocument.originalInvoiceNumber;
            this.returnOrder.customsDocument.originalInvoiceDate = orderData.customsDocument.originalInvoiceDate;
            let $posIndex = 0;
            orderData.customsDocument.positions.forEach((position: any) => {
                this.returnOrder.customsDocument.positions[$posIndex].positionDescription = position.positionDescription;
                this.returnOrder.customsDocument.positions[$posIndex].count = position.count;
                this.returnOrder.customsDocument.positions[$posIndex].weightInGrams = position.weightInGrams;
                this.returnOrder.customsDocument.positions[$posIndex].values = position.values;
                this.returnOrder.customsDocument.positions[$posIndex].originCountry = position.originCountry;
                this.returnOrder.customsDocument.positions[$posIndex].articleReference = position.articleReference;
                this.returnOrder.customsDocument.positions[$posIndex].tarifNumber = position.tarifNumber;
            })
            this.busy = false;
        },
        fetchLabelList: async function (): Promise<any> {
            if (this.orderId === 0) {
                console.info('not fetching labels for undefined order');
                return;
            }
            console.info('fetching labels for order ' + this.orderId);
            let url = `${window.jsEnvironment.baseUrl}/admin/dhlreturns/labellist/` + this.orderId;
            let response = await window.fetch(url);
            if (!response.ok) {
                console.info('Could not retrieve order data: ' + response.status + ' / ' + response.statusText);
                throw new Error(response.statusText);
            }
            let labelListResponse = await response.json();
            if (labelListResponse.status !== 'OK') {
                console.error('could not retrieve label list');
            }
            console.info('got ' + labelListResponse.labelList.length + ' labels');
            this.labelList = labelListResponse.labelList;
        },
        makeLabel: async function (event: Event) {
            this.busy = true;
            event.preventDefault();
            let url = `${window.jsEnvironment.baseUrl}/admin/dhlreturns/makelabel`;
            let requestBody = {
                returnOrder: this.returnOrder,
                orderId: this.orderId
            }
            let response = await window.fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            await this.fetchLabelList();
            this.busy = false;
            if (!response.ok) {
                window.alert('ERROR: ' + response.statusText);
                return;
            }
            let responseData = await response.json();
            if (responseData.status !== 'OK') {
                window.alert(responseData.message);
                return;
            }
            window.open(responseData.labelUrl);
        },
        sendByEmail: async function (event: Event, filename: string, receiver: string) {
            event.preventDefault();
            window.alert(filename + ' ' + receiver);
        }
    }
});

</script>

<style lang="scss" scoped>
#dhlreturns {
    @import "../../../../Layout/ui/assets/styles/variables";

    .row {
        margin-bottom: .5rem;
    }

    input, select {
        background-color: #FFFFFF;
        border: 1px solid darken($border-color, 10);
        padding: 0.25rem 0.5rem;
        width: 100%;
        height: 2rem;
        color: $text-color-light;
        border-radius: 2px;
        transition: 0.25s ease border-color;

        &:focus {
            border-color: $gambio-blue;
            outline: none;
        }

        &:required {
            border-right-color: red;
        }
    }

    select {
        width: 100%;
        height: 2rem;
        appearance: none;
        background: url(../../../../Layout/ui/assets/images/logos/icon-caret-down.png) no-repeat right 6px center #FFFFFF;
    }

    div.cn23 {
        transition: 0.25s ease;
    }

    &.busy * {
        cursor: wait;
    }

    #busycover {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: none;
    }

    &.busy #busycover {
        display: block;
    }

    table.labellist {
        margin-top: 2rem;
    }
}

</style>
