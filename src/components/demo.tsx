import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Container from "./container";
import Section from "./section";

export default function DemoPage() {
  return (
    <Container>
      <Section>
        <div className="space-y-20">
          {/* Typography */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Typography</h2>
            <div className="space-y-4">
              <Typography as={"h1"} variant={"title"}>
                Title (font-size: 56px; font-weight: 700)
              </Typography>
              <Typography as={"h2"} variant={"subtitle"}>
                Sub Title (font-size: 24px; font-weight: 500)
              </Typography>
              <Typography variant={"body"}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
                nam minus necessitatibus quibusdam non doloremque voluptas magni
                repellendus adipisci voluptates. (font-size: 17px; font-weight:
                400)
              </Typography>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">UI Buttons</h2>
              <div className="space-x-4">
                <Button website={"primary"}>Documents</Button>
                <Button website={"secondary"}>Documents</Button>
                <Button variant={"outline"} website={"outline"}>
                  Documents
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">System Buttons</h2>
              <div className="space-x-4">
                <Button variant={"default"}>Documents</Button>
                <Button variant={"destructive"}>Documents</Button>
                <Button variant={"ghost"}>Documents</Button>
                <Button variant={"link"}>Documents</Button>
                <Button variant={"outline"}>Documents</Button>
                <Button variant={"secondary"}>Documents</Button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Divider</h2>
            <Divider variant={"dashed"} />
          </div>

          {/* Cards */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Cards</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>
                      <Typography
                        as={"h3"}
                        variant={"title"}
                        className="text-primary"
                      >
                        Card Title
                      </Typography>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Typography variant={"body"} className="text-balance">
                      Lorem ipsum dolor sit
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="space-y-4">
            <Divider variant={"dashed"} />
          </div>

          {/* Form */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Form</h2>
            <Card>
              <CardContent>
                <FieldGroup>
                  <FieldSet>
                    <FieldLegend>Payment Method</FieldLegend>
                    <FieldDescription>
                      All transactions are secure and encrypted
                    </FieldDescription>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                          Name on Card
                        </FieldLabel>
                        <Input
                          id="checkout-7j9-card-name-43j"
                          placeholder="Evil Rabbit"
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                          Card Number
                        </FieldLabel>
                        <Input
                          id="checkout-7j9-card-number-uw1"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                        <FieldDescription>
                          Enter your 16-digit card number
                        </FieldDescription>
                      </Field>
                      <div className="grid grid-cols-3 gap-4">
                        <Field>
                          <FieldLabel htmlFor="checkout-exp-month-ts6">
                            Month
                          </FieldLabel>
                          <Select defaultValue="">
                            <SelectTrigger id="checkout-exp-month-ts6">
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="01">01</SelectItem>
                                <SelectItem value="02">02</SelectItem>
                                <SelectItem value="03">03</SelectItem>
                                <SelectItem value="04">04</SelectItem>
                                <SelectItem value="05">05</SelectItem>
                                <SelectItem value="06">06</SelectItem>
                                <SelectItem value="07">07</SelectItem>
                                <SelectItem value="08">08</SelectItem>
                                <SelectItem value="09">09</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="11">11</SelectItem>
                                <SelectItem value="12">12</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="checkout-7j9-exp-year-f59">
                            Year
                          </FieldLabel>
                          <Select defaultValue="">
                            <SelectTrigger id="checkout-7j9-exp-year-f59">
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2026">2026</SelectItem>
                                <SelectItem value="2027">2027</SelectItem>
                                <SelectItem value="2028">2028</SelectItem>
                                <SelectItem value="2029">2029</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="checkout-7j9-cvv">
                            CVV
                          </FieldLabel>
                          <Input
                            id="checkout-7j9-cvv"
                            placeholder="123"
                            required
                          />
                        </Field>
                      </div>
                    </FieldGroup>
                  </FieldSet>
                  <FieldSeparator />
                  <FieldSet>
                    <FieldLegend>Billing Address</FieldLegend>
                    <FieldDescription>
                      The billing address associated with your payment method
                    </FieldDescription>
                    <FieldGroup>
                      <Field orientation="horizontal">
                        <Checkbox
                          id="checkout-7j9-same-as-shipping-wgm"
                          defaultChecked
                        />
                        <FieldLabel
                          htmlFor="checkout-7j9-same-as-shipping-wgm"
                          className="font-normal"
                        >
                          Same as shipping address
                        </FieldLabel>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  <FieldSet>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="checkout-7j9-optional-comments">
                          Comments
                        </FieldLabel>
                        <Textarea
                          id="checkout-7j9-optional-comments"
                          placeholder="Add any additional comments"
                          className="resize-none"
                        />
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  <Field orientation="horizontal">
                    <Button type="submit">Submit</Button>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </Container>
  );
}
