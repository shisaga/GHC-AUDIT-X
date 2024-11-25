import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Checkbox,
} from "@material-tailwind/react";

export function TremsCondition() {
  const [open, setOpen] = useState(false);
  const [readed, setReadAllTerms] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Terms And Conditions</DialogHeader>
        <DialogBody className="h-[42rem] overflow-scroll">
          <Typography className="font-normal">
            <div className="UserTermsAndConditions_termsAndConditionsText__ZOP9i">
              <div className="UserTermsAndConditions_heading__P9cxs">
                1. Introduction
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                These Terms of Use (“Terms of Use”) constitute a legally binding
                agreement made between you, whether personally or on behalf of
                an entity (“you”), and AuditX Inc., doing business as AuditX
                ("AuditX", “we”, “us”, or “our”), concerning your access to and
                use of the http://AuditX.ca website, our CRM, and any other
                media forms, media channels, mobile websites, or mobile
                applications related, linked, or otherwise connected thereto
                (collectively, the “Service”). You agree that by accessing the
                Service, you have read, understood, and agreed to be bound by
                all of these Terms of Use. These Terms and conditions apply to
                this website and to the transactions related to our products and
                services. You may be bound by additional contracts related to
                your relationship with us or any products or services that you
                receive from us. If any provisions of the additional contracts
                conflict with any provisions of these Terms, the provisions of
                these additional contracts will control and prevail.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                2. Binding
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                By registering with, accessing, or otherwise using this website,
                you hereby agree to be bound by these Terms and conditions set
                forth below. The mere use of this website implies the knowledge
                and acceptance of these Terms and conditions. In some particular
                cases, we can also ask you to explicitly agree.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                3. Electronic communication
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                By using this website or communicating with the website's owner
                through any electronic means, such as email, text message, or
                regular notifications, the user agrees to receive all types of
                electronic communications from the website and its owner. This
                includes, but is not limited to, agreements, notices,
                disclosures, and other important information related to the use
                of the website or any services provided by the website. The user
                acknowledges that these electronic communications will satisfy
                any legal requirement for written communication, and that they
                have the necessary equipment and means to receive and read these
                electronic communications. The user also agrees to be bound by
                any agreements, notices, disclosures, or other communications
                provided to them electronically.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                4. Intellectual property
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Intellectual property: The website and its owners or licensors
                own and control all of the copyright and other intellectual
                property rights in the website and the data, information, and
                other resources displayed by or accessible within the website.
                The user is not allowed to reproduce, distribute, modify,
                display or make derivative works of any of the material without
                the express written permission of the website or its licensors.
                This includes, but is not limited to, text, graphics, logos,
                images, audio, video, and software. Copyright infringement: The
                user must seek permission before using any of the website's
                content in any manner that is not explicitly authorized by the
                website or its licensors. Any unauthorized use of the website's
                content, including but not limited to reproduction,
                distribution, modification, display, or creation of derivative
                works, may be considered copyright infringement and may result
                in legal action and penalties. Trademark infringement: The
                website's trademarks and logos are protected under federal and
                state trademark laws. The user is not allowed to use the
                website's trademarks or logos without the express written
                permission of the website or its licensors. Any unauthorized use
                of the website's trademarks or logos may be considered trademark
                infringement and may result in legal action and penalties. Legal
                action: The website and its licensors reserve the right to take
                legal action against any user who violates the website's
                intellectual property rights. This may include, but is not
                limited to, seeking injunctive relief, damages, and attorney's
                fees. The user will be held liable for any damages resulting
                from their unauthorized use of the website's content. Protection
                Measures: The website may implement various protection measures
                to prevent infringement of its intellectual property rights,
                such as digital rights management systems and watermarking. The
                user agrees not to tamper with or circumvent these protection
                measures. Monitoring: The website reserves the right to monitor
                the user's use of the website and its content to ensure
                compliance with the terms of this agreement and to protect its
                intellectual property rights. Additional Provisions: The user
                acknowledges that the website's intellectual property rights are
                valid and enforceable and agrees to not contest their validity
                or enforceability in any way. The user also agrees to promptly
                notify the website of any suspected infringement of the
                website's intellectual property rights.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                5. Newsletter
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Notwithstanding the foregoing, you may forward our newsletter in
                the electronic form to others who may be interested in visiting
                our website.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                6. Third-party property
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Our website may include hyperlinks or other references to other
                party’s websites. We do not monitor or review the content of
                other party’s websites which are linked to from this website.
                Products or services offered by other websites shall be subject
                to the applicable Terms and Conditions of those third parties.
                Opinions expressed or material appearing on those websites are
                not necessarily shared or endorsed by us. We will not be
                responsible for any privacy practices or content of these sites.
                You bear all risks associated with the use of these websites and
                any related third-party services. We will not accept any
                responsibility for any loss or damage in whatever manner,
                however caused, resulting from your disclosure to third parties
                of personal information.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                7. Responsible use
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                By visiting our website, you agree to use it only for lawful and
                appropriate purposes. You agree to abide by the terms outlined
                in these Terms, any additional contracts with us, and applicable
                laws, regulations, and generally accepted online practices and
                industry guidelines. You are prohibited from using our website
                or services to publish, distribute or use any material that
                contains malicious computer software or that may cause damage to
                the website or interfere with its performance, availability, or
                accessibility. You must not use data collected from our website
                for any direct marketing activity or conduct any systematic or
                automated data collection activities, including scraping or
                harvesting, on or in relation to our website without obtaining
                explicit written consent from us. Any unauthorized collection,
                use, or sharing of data from our website is strictly prohibited
                and may result in legal action. In the event of unauthorized
                collection, use or sharing of data from our website, the
                offender will be held liable for any damages incurred by us, and
                will be required to pay a fine of $10,000,000 (USD). The
                offender will also be responsible for all legal fees and
                expenses. The user agrees to indemnify and hold us harmless from
                and against any and all claims, damages, costs and expenses,
                including reasonable attorneys’ fees, arising from or related to
                the user's use or misuse of the website, violation of these
                terms, or violation of any rights of any third party.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                8. Registration
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                You may register for an account with our website. During this
                process, you may be required to choose a password. You are
                responsible for maintaining the confidentiality of passwords and
                account information and agree not to share your passwords,
                account information, or secured access to our website or
                services with any other person. You must not allow any other
                person to use your account to access the website because you are
                responsible for all activities that occur through the use of
                your passwords or accounts. You must notify us immediately if
                you become aware of any disclosure of your password.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                9. Content posted by you
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                We may provide various open communication tools on our website,
                such as blog comments, blog posts, forums, message boards,
                ratings and reviews, and various social media services. It might
                not be feasible for us to screen or monitor all content that you
                or others may share or submit on or through our website.
                However, we reserve the right to review the content and to
                monitor all use of and activity on our website, and remove or
                reject any content in our sole discretion. By posting
                information or otherwise using any open communication tools as
                mentioned, you agree that your content will comply with these
                Terms and Conditions and must not be illegal or unlawful or
                infringe any person’s legal rights.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                10. Idea submission
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                By sharing any ideas with us, you grant us a worldwide,
                irrevocable, non-exclusive, royalty-free license to use and
                exploit those ideas in any way, without any further compensation
                or recognition to you. This includes, but is not limited to,
                incorporating the ideas into our products or services,
                developing, manufacturing, having manufactured, promoting,
                importing, or offering for sale any products or services based
                on those ideas. We will have the right to sublicense these
                rights to any third party. You also waive any moral rights you
                may have in any material submitted by you, meaning that you will
                not have the right to claim authorship of the idea, object to
                any derogatory treatment of the idea, or to any other rights
                that may arise from authorship. You warrant that any ideas
                submitted by you are original and do not infringe on any third
                party's intellectual property rights, and that you have the
                right to grant the rights granted by this license. By sharing
                any ideas with us, you acknowledge that we are not under any
                obligation to use, develop, or exploit the ideas in any way and
                that we may already be working on similar ideas or have similar
                ideas under consideration.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                11. Termination of use
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                We may, in our sole discretion, at any time modify or
                discontinue access to, temporarily or permanently, the website
                or any Service thereon. You agree that we will not be liable to
                you or any third party for any such modification, suspension or
                discontinuance of your access to, or use of, the website or any
                content that you may have shared on the website. You will not be
                entitled to any compensation or other payment, even if certain
                features, settings, and/or any Content you have contributed or
                have come to rely on, are permanently lost. You must not
                circumvent or bypass, or attempt to circumvent or bypass, any
                access restriction measures on our website.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                12. Warranties and liability
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Nothing in this section will limit or exclude any warranty
                implied by law that it would be unlawful to limit or to exclude.
                This website and all content on the website are provided on an
                “as is” and “as available” basis and may include inaccuracies or
                typographical errors. We expressly disclaim all warranties of
                any kind, whether express or implied, as to the availability,
                accuracy, or completeness of the Content. We make no warranty
                that: · this website or our products or services will meet your
                requirements; · this website will be available on an
                uninterrupted, timely, secure, or error-free basis; · the
                quality of any product or service purchased or obtained by you
                through this website will meet your expectations. Nothing on
                this website constitutes or is meant to constitute, legal,
                financial or medical advice of any kind. If you require advice
                you should consult an appropriate professional. This section
                will apply to the maximum extent permitted by applicable law and
                will not limit or exclude our liability in respect of any matter
                which it would be unlawful or illegal for us to limit or to
                exclude our liability. In no event will we be liable for any
                direct or indirect damages (including any damages for loss of
                profits or revenue, loss or corruption of data, software or
                database, or loss of or harm to property or data) incurred by
                you or any third party, arising from your access to, or use of,
                our website
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                13. Privacy
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                To access our website and/or services, you may be required to
                provide certain information about yourself as part of the
                registration process. You agree that any information you provide
                will always be accurate, correct, and up to date. We take your
                personal data seriously and are committed to protecting your
                privacy. We will not use your email address for unsolicited mail
                except welcome emails and notification email. Any emails sent by
                us to you will only be in connection with the provision of
                agreed products or services. We have developed a policy to
                address any privacy concerns you may have. For more information,
                please see our Privacy Statement and our Cookie Policy.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                14. Export restrictions / Legal compliance
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Access to the website from territories or countries where the
                Content or purchase of the products or Services sold on the
                website is illegal is prohibited. You may not use this website
                in violation of export laws and regulations of Canada.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                15. Affiliate marketing
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Through this Website we may engage in affiliate marketing
                whereby we receive a percentage of a commission on the sale of
                services or products on or through this website. We may also
                accept sponsorships or other forms of advertising compensation
                from businesses. This disclosure is intended to comply with
                legal requirements on marketing and advertising which may apply,
                such as the US Federal Trade Commission Rules.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                16. Assignment
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                You may not assign, transfer or subcontract any of your rights
                and/or obligations under these Terms and conditions, in whole or
                in part, to any third party without our prior written consent.
                Any purported assignment in violation of this Section will be
                null and void.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                17. Breaches of these Terms and conditions
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Without prejudice to our other rights under these Terms and
                Conditions, if you breach these Terms and Conditions in any way,
                we may take such action as we deem appropriate to deal with the
                breach, including but not limited to: • Temporarily or
                permanently suspending your access to the website: If we suspect
                that you have breached any of the terms outlined in these terms
                and conditions, we reserve the right to temporarily or
                permanently suspend your access to the website. This means that
                you will not be able to access the website or any of its content
                or services until the matter is resolved. • Contacting your
                internet service provider: We may contact your internet service
                provider and request that they block your access to the website.
                This is a security measure that we may take to prevent further
                breaches of these terms and conditions. • Commencing legal
                action: We may commence legal action against you for any
                breaches of these terms and conditions. This may include, but is
                not limited to, seeking injunctive relief, damages, and
                attorney's fees. • Sending a warning: We may send you a warning
                notice to inform you of the breach and to give you an
                opportunity to rectify the situation. • Other actions: We may
                take other actions that we deem appropriate to deal with the
                breach, such as disabling your account or limiting your access
                to certain features of the website. It's worth noting that the
                action we take will depend on the nature and severity of the
                breach and our discretion. These actions are not exclusive and
                we reserve the right to take any other action we deem
                appropriate.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                19. Indemnification
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                You agree to indemnify, defend and hold us harmless, from and
                against any and all claims, liabilities, damages, losses and
                expenses, relating to your violation of these Terms and
                conditions, and applicable laws, including intellectual property
                rights and privacy rights. You will promptly reimburse us for
                our damages, losses, costs and expenses relating to or arising
                out of such claims.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                20. Waiver
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Failure to enforce any of the provisions set out in these Terms
                and Conditions and any Agreement, or failure to exercise any
                option to terminate, shall not be construed as waiver of such
                provisions and shall not affect the validity of these Terms and
                Conditions or of any Agreement or any part thereof, or the right
                thereafter to enforce each and every provision.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                21. Language
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                These Terms and Conditions will be interpreted and construed
                exclusively in English. All notices and correspondence will be
                written exclusively in that language.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                22. Entire agreement
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                These Terms and Conditions, together with our privacy statement
                and cookie policy, constitute the entire agreement between you
                and AuditX in relation to your use of this website.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                23. Updating of these Terms and conditions
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                We may update these Terms and Conditions from time to time. It
                is your obligation to periodically check these Terms and
                Conditions for changes or updates. The date provided at the
                beginning of these Terms and Conditions is the latest revision
                date. Changes to these Terms and Conditions will become
                effective upon such changes being posted to this website. Your
                continued use of this website following the posting of changes
                or updates will be considered notice of your acceptance to abide
                by and be bound by these Terms and Conditions. You can access
                these terms and conditions at this URL: www.auditx.ca/terms
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                24. Choice of Law and Jurisdiction
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                These Terms and Conditions shall be governed by the laws of
                Canada. Any disputes relating to these Terms and Conditions
                shall be subject to the jurisdiction of the courts of Canada. If
                any part or provision of these Terms and Conditions is found by
                a court or other authority to be invalid and/or unenforceable
                under applicable law, such part or provision will be modified,
                deleted and/or enforced to the maximum extent permissible so as
                to give effect to the intent of these Terms and Conditions. The
                other provisions will not be affected.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                25. Contact information
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                This website is owned and operated by AuditX. You may contact us
                regarding these Terms and Conditions through our contact page.
                Our complete Statutory and regulatory disclosures can be found
                on this page.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                Refund Policy
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                We have a no refund policy. If you need help contact us.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                Cookie Policy
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Our CRM website uses cookies to enhance your browsing experience
                and to personalize the way we interact with you. A cookie is a
                small data file that is transferred to your device when you
                visit our website. It allows our website to remember your
                preferences, login information, and other settings, making your
                future visits more efficient and convenient. We use different
                types of cookies, such as: • Session cookies: These cookies are
                temporary and expire when you close your browser. They are used
                to remember your preferences and settings during a single
                browsing session. • Persistent cookies: These cookies remain on
                your device for a longer period of time, even after you close
                your browser. They are used to remember your preferences and
                settings for future visits to our website. • First-party
                cookies: These cookies are set by the website you are visiting.
                They are used to remember your preferences and settings, as well
                as to collect information about your browsing behavior. •
                Third-party cookies: These cookies are set by third-party
                websites or services, such as analytics providers, social media
                platforms, and advertising networks. They are used to track your
                browsing behavior across multiple websites, deliver targeted
                advertising, and analyze website traffic. We use cookies for a
                variety of purposes, such as: • Remembering your preferences and
                settings: We use cookies to remember your preferred language,
                time zone, and other settings, so you don't have to enter them
                every time you visit our website. • Improving your browsing
                experience: We use cookies to personalize the way we interact
                with you, such as by showing you content that is relevant to
                your interests or by remembering your progress through a form or
                a survey. • Analyzing website traffic: We use cookies to analyze
                website traffic and understand how visitors use our website.
                This helps us to improve the performance, functionality, and
                content of our website. By using our website, you consent to our
                use of cookies in accordance with this policy. If you do not
                agree to our use of cookies, you should set your browser
                settings accordingly or not use our website. We make every
                effort to ensure that the information we collect through the use
                of cookies is anonymous and does not personally identify you.
                Furthermore, we take all necessary precautions to secure the
                data collected through the use of cookies and to protect it from
                unauthorized access, alteration, or disclosure. We also comply
                with all relevant laws and regulations regarding the use of
                cookies, including obtaining the necessary consents and
                providing appropriate disclosures. By using our website, you
                agree that you will not hold us liable for any damages or claims
                arising from our use of cookies in accordance with this policy.
                If you have any concerns or questions about our use of cookies,
                please contact us. Please note that we reserve the right to make
                changes to this cookie policy at any time without prior notice.
                We encourage you to review this policy periodically to stay
                informed of any updates. Additionally, we provide you with the
                option to opt-out of the use of cookies on our website. You can
                do this by adjusting your browser settings to disable cookies or
                by using any available opt-out mechanisms provided by the
                third-party service providers. However, please note that
                disabling cookies may limit your ability to use certain features
                of our website and may affect your overall browsing experience.
                We also use web analytics tools to collect and analyze
                information about the use of our website. These tools use
                cookies to collect information such as the number of visitors to
                our website, the websites that referred them to us, and the
                pages they visited on our website. We use this information to
                improve the performance and content of our website. It's worth
                noting that we use cookies for authentication and security
                purposes, so disabling cookies may affect the functionality of
                certain features on our website. In summary, we use cookies to
                improve the functionality and performance of our website and
                provide a better user experience. We comply with all relevant
                laws and regulations regarding the use of cookies and take all
                necessary precautions to protect the data collected through
                their use. If you have any questions or concerns regarding our
                use of cookies, please don't hesitate to contact us.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                Privacy Policy
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                This privacy statement was last changed on January 22, 2023,
                last checked on January 22, 2023, and applies to all users of
                AuditX. In this privacy statement, we explain what we do with
                the data we obtain about you via https://auditx.ca or any
                affiliated websites . We recommend you carefully read this
                statement. In our processing we comply with the requirements of
                privacy legislation. That means, among other things, that: · we
                clearly state the purposes for which we process personal data.
                We do this by means of this privacy statement; · we aim to limit
                our collection of personal data to only the personal data
                required for legitimate purposes; · we first request your
                explicit consent to process your personal data in cases
                requiring your consent; · we take appropriate security measures
                to protect your personal data and also require this from parties
                that process personal data on our behalf; · we respect your
                right to access your personal data or have it corrected or
                deleted, at your request. If you have any questions, or want to
                know exactly what data we keep of you, please contact us.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                1. Purpose and categories of data
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Categories of personal information to be collected and the
                purpose for which the categories shall be used. We use your data
                for the following purposes:
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                1.1 Contact - Through phone, mail, email and/or webforms
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                · A first and last name · Account name or alias · A home or
                other physical address, including street name and name of a city
                or town · An email address · A telephone number · Any other
                identifier that permits the physical or online contacting of a
                specific individual · IP address · A signature · Physical
                characteristics or description · Driver's license · State
                identification card number · Education information ·
                Professional or employment-related information · Employment
                history · Bank account number · Financial information such as
                bank account number or credit card number · Commercial
                information, including records of personal property, products or
                services purchased, obtained, or considered · Internet activity
                information, including, but not limited to, browsing history,
                search history, and information regarding a consumer's
                interaction with an Internet Web site, application, or
                advertisement · Geolocation data · Audio, electronic, visual,
                thermal, olfactory, or similar information
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                1.2 Payments
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                · A first and last name · Account name or alias · A home or
                other physical address, including street name and name of a city
                or town · An email address · A telephone number · Any other
                identifier that permits the physical or online contacting of a
                specific individual · IP address · A signature · Physical
                characteristics or description · Driver's license · State
                identification card number · Education information ·
                Professional or employment-related information · Bank account
                number · Financial information such as bank account number or
                credit card number · Commercial information, including records
                of personal property, products or services purchased, obtained,
                or considered · Internet activity information, including, but
                not limited to, browsing history, search history, and
                information regarding a consumer's interaction with an Internet
                Web site, application, or advertisement · Geolocation data
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                1.3 Registering an account
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                · A first and last name · Account name or alias · A home or
                other physical address, including street name and name of a city
                or town · An email address · A telephone number · Any other
                identifier that permits the physical or online contacting of a
                specific individual · IP address · A signature · Physical
                characteristics or description · Driver's license · State
                identification card number · Education information ·
                Professional or employment-related information · Employment
                history · Bank account number · Financial information such as
                bank account number or credit card number · Medical information
                · Commercial information, including records of personal
                property, products or services purchased, obtained, or
                considered · Internet activity information, including, but not
                limited to, browsing history, search history, and information
                regarding a consumer's interaction with an Internet Web site,
                application, or advertisement · Geolocation data
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                1.4 Newsletters
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                · A first and last name · Account name or alias · A home or
                other physical address, including street name and name of a city
                or town · An email address · A telephone number · Any other
                identifier that permits the physical or online contacting of a
                specific individual · IP address · A signature · Physical
                characteristics or description · Internet activity information,
                including, but not limited to, browsing history, search history,
                and information regarding a consumer's interaction with an
                Internet Web site, application, or advertisement · Geolocation
                data
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                1.5 To support services or products that a customer wants to buy
                or has purchased
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                · A first and last name · Account name or alias · A home or
                other physical address, including street name and name of a city
                or town · An email address · A telephone number · Any other
                identifier that permits the physical or online contacting of a
                specific individual · IP address · A signature · Physical
                characteristics or description · Driver's license · State
                identification card number · Education information ·
                Professional or employment-related information · Employment
                history · Bank account number · Financial information such as
                bank account number or credit card number · Commercial
                information, including records of personal property, products or
                services purchased, obtained, or considered · Internet activity
                information, including, but not limited to, browsing history,
                search history, and information regarding a consumer's
                interaction with an Internet Web site, application, or
                advertisement · Geolocation data
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                1.6 To be able to comply with legal obligations
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                · A first and last name · Account name or alias · A home or
                other physical address, including street name and name of a city
                or town · An email address · A telephone number · Any other
                identifier that permits the physical or online contacting of a
                specific individual · IP address · A signature · Physical
                characteristics or description · Education information ·
                Professional or employment-related information · Employment
                history · Bank account number · Financial information such as
                bank account number or credit card number · Commercial
                information, including records of personal property, products or
                services purchased, obtained, or considered · Internet activity
                information, including, but not limited to, browsing history,
                search history, and information regarding a consumer's
                interaction with an Internet Web site, application, or
                advertisement · Geolocation data
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                1.7 Compiling and analyzing statistics for website improvement
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                · A first and last name · Account name or alias · A home or
                other physical address, including street name and name of a city
                or town · An email address · A telephone number · IP address · A
                signature · Physical characteristics or description · Driver's
                license · State identification card number · Education
                information · Professional or employment-related information ·
                Employment history · Bank account number · Financial information
                such as bank account number or credit card number · Commercial
                information, including records of personal property, products or
                services purchased, obtained, or considered · Internet activity
                information, including, but not limited to, browsing history,
                search history, and information regarding a consumer's
                interaction with an Internet Web site, application, or
                advertisement · Geolocation data
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                1.8 To be able to offer personalized products and services
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                · A first and last name · Account name or alias · A home or
                other physical address, including street name and name of a city
                or town · An email address · A telephone number · Any other
                identifier that permits the physical or online contacting of a
                specific individual · IP address · A signature · Physical
                characteristics or description · Driver's license · State
                identification card number · Education information ·
                Professional or employment-related information · Employment
                history · Bank account number · Financial information such as
                bank account number or credit card number · Commercial
                information, including records of personal property, products or
                services purchased, obtained, or considered · Internet activity
                information, including, but not limited to, browsing history,
                search history, and information regarding a consumer's
                interaction with an Internet Web site, application, or
                advertisement · Geolocation data
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                1.9 To sell data to Third Parties
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                · A first and last name · Account name or alias · A home or
                other physical address, including street name and name of a city
                or town · An email address · A telephone number · Any other
                identifier that permits the physical or online contacting of a
                specific individual · IP address · Physical characteristics or
                description · Commercial information, including records of
                personal property, products or services purchased, obtained, or
                considered · Internet activity information, including, but not
                limited to, browsing history, search history, and information
                regarding a consumer's interaction with an Internet Web site,
                application, or advertisement · Geolocation data
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                1.10 Deliveries
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                · A first and last name · Account name or alias · A home or
                other physical address, including street name and name of a city
                or town · An email address · A telephone number · Any other
                identifier that permits the physical or online contacting of a
                specific individual · IP address · Geolocation data
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                2. Disclosure practices
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                We disclose personal information if we are required by law or by
                a court order, in response to a law enforcement agency, to the
                extent permitted under other provisions of law, to provide
                information, or for an investigation on a matter related to
                public safety.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                3. How we respond to Do Not Track signals &amp; Global Privacy
                Control
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Our website does not respond to and does not support the Do Not
                Track (DNT) header request field.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                4. Cookies
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Our website uses cookies. For more information about cookies,
                please refer to our Cookie Policy on our Cookie Policy (CA)
                webpage. We have concluded a data Processing Agreement with
                Google.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                5. Security
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                1. Access Control: Only authorized personnel will have access to
                personal data, and all access will be logged and regularly
                reviewed. Passwords will be required for all user accounts and
                will be regularly rotated. Two-factor authentication will be
                implemented for all access to sensitive data upon request of
                service organization. 2. Data will be stored in secure servers
                that are protected by firewalls and other security measures. 3.
                Regular Updates: Our security measures will be regularly
                reviewed and updated to ensure they are current and effective.
                We will also stay informed about new security threats and
                vulnerabilities.. 4. Continuous monitoring and testing: We will
                continuously monitor and test our security measures to ensure
                they are working as intended and promptly address any
                vulnerabilities that may be identified. This includes monitoring
                logs and alerts. By implementing these security measures and
                regularly reviewing them, we are committed to protecting the
                personal data of our users and ensuring its security. We are
                committed to maintaining the trust of our users and will take
                all necessary steps to safeguard their personal information.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                6. Third party websites
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                This privacy statement does not apply to third party websites
                connected by links on our website. We cannot guarantee that
                these third parties handle your personal data in a reliable or
                secure manner. We recommend you read the privacy statements of
                these websites prior to making use of these websites.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                7. Amendments to this privacy statement
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                We reserve the right to make amendments to this privacy
                statement. It is recommended that you consult this privacy
                statement regularly in order to be aware of any changes. In
                addition, we will actively inform you wherever possible.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                8. Accessing and modifying your data
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                If you have any questions or want to know which personal data we
                have about you, please contact us. Please make sure to always
                clearly state who you are, so that we can be certain that we do
                not modify or delete any data of the wrong person. We shall
                provide the requested information only upon receipt of a
                verifiable consumer request. You can contact us by using the
                information below. 8.1 You have the following rights with
                respect to your personal data: · You may submit a request for
                access to the data we process about you. · You may request an
                overview, in a commonly used format, of the data we process
                about you. · You may request correction or deletion of the data
                if it is incorrect or not or no longer relevant. Where
                appropriate, the amended information shall be transmitted to
                third parties having access to the information in question. ·
                You have the right to withdraw consent at any time, subject to
                legal or contractual restrictions and reasonable notice. You
                will be informed of the implications of such withdrawal. · You
                have the right to address a challenge concerning non-compliance
                with PIPEDA to our organization and, if the issue is not
                resolved, to the Office of the Privacy Commissioner of Canada. ·
                We shall give access to personal information in an alternative
                format to an individual with a sensory disability who has a
                right of access to personal information under PIPEDA and who
                requests that it be transmitted in the alternative format if (a)
                a version of the information already exists in that format; or
                (b) its conversion into that format is reasonable and necessary
                in order for the individual to be able to exercise rights.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                9. Children
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Our website is not designed to attract children and it is not
                our intent to collect personal data from children under the age
                of consent in their country of residence. We therefore request
                that children under the age of consent do not submit any
                personal data to us.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                10. Contact details
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                AuditX Website: https://www.auditx.ca Email: info@auditx.ca
                Phone number: 647-549-6923 or 647-609-5459
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                What we collect and store
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                This sample language includes the basics around what personal
                data your store may be collecting, storing and sharing, as well
                as who may have access to that data. Depending on what settings
                are enabled and which additional plugins are used, the specific
                information shared by your profile will vary. We recommend
                consulting with a lawyer when deciding what information to
                disclose on your privacy policy. We collect information about
                you during the checkout process on our website.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                Data We Collect
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                At AuditX, we collect certain information from our users in
                order to provide our services. This information includes:
                Personal Information: We collect personal information such as
                name, email address, and contact information when you register
                for an account or contact us for support. We may also collect
                additional information such as your job title, company name, and
                location, which we use to better understand our user base and to
                provide relevant services and content. Usage Data: We collect
                information about how you use our service, including the pages
                you visit, the features you use, and the time spent on the
                service. This data is used to understand how our service is
                used, to identify areas for improvement, and to provide more
                relevant content and features. Device Information: We collect
                information about the device you use to access our service,
                including the device's IP address, operating system, and browser
                type. This data is used to ensure that our service is compatible
                with the devices and browsers used by our users. Log Data: We
                collect log data such as the date and time of your visit, the
                pages you accessed, and the actions you performed while using
                the service. This data is used to troubleshoot issues and to
                improve the security of our service. Cookies and Tracking
                Technologies: We may use cookies and other tracking technologies
                to collect information about your use of our service. This
                includes data such as your browsing history, search queries, and
                preferences. We use this data to provide a more personalized
                experience and to improve the performance of our service.
                Payment Information: When you purchase a subscription or other
                paid service from us, we may collect payment information such as
                your credit card or other payment specifics such as access to
                third party payment platforms. This information is used solely
                for billing purposes and is securely stored in accordance with
                industry standards. Profile Information: We may ask for
                additional profile information such as age, gender, and
                education level, which we use to better understand our user base
                and to provide relevant services and content. This information
                is optional and will not affect your ability to use our service.
                Industry or Field of Work: We may ask for information about your
                industry or field of work, which we use to provide relevant
                services and content. System Configurations: We may collect
                information about the systems and configurations you use to
                access our service, such as operating system, browser type, and
                hardware specifications. This information is used to ensure that
                our service is compatible with the devices and browsers used by
                our users. Feedback and Surveys: We may collect feedback and
                survey responses from users in order to gather user opinions and
                preferences. This information is used to improve the service and
                to provide a more personalized experience. Social Media Account
                Information: We may ask for information about your social media
                accounts in order to integrate with other platforms and improve
                user experience. This information is optional and will not
                affect your ability to use our service. Location Data: We may
                collect data about your location, such as your IP address, which
                we use to provide relevant content and features based on your
                geographical location. This information is used solely to
                enhance the user experience and will not be shared with third
                parties without your consent. We use the information we collect
                to provide and improve our services, to communicate with you,
                and to personalize your experience. We may also use the
                information for research, analytics, and to comply with legal
                and regulatory requirements. We may also use the information to
                send you promotional or marketing materials or sell to
                advertisers. We take the security of your information very
                seriously and have implemented appropriate technical and
                organizational measures to protect it from unauthorized access,
                use, or disclosure. These measures include firewalls,
                encryption, access controls, and regular security audits. We
                also conduct regular backups of our systems to ensure that your
                data is protected in case of a disaster. We will retain your
                information for as long as necessary to provide our services to
                you, to comply with legal and regulatory requirements, or for
                other business purposes. Once it is no longer needed, we will
                securely delete or destroy your information.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                Payment
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Payment: The user agrees to pay a monthly usage fee for access
                to the software. The fee must be paid on the first day of
                subscription period, in advance. If the payment is not received
                on time, the user's access to the software will be suspended.
                Late Payment: In case of multiple late payments, the user's
                account may be permanently banned. Fees for Late Payment: If the
                user's access to the software is suspended due to late payment,
                the user may be charged a late fee for each month that the
                payment is late. Refunds: No refunds will be given for any fees
                or payments related to the software. Use of Software: The user
                agrees to use the software only in accordance with the terms and
                conditions of the license agreement. Any unauthorized use of the
                software may result in the termination of the user's account and
                possible legal action. Disclaimer: The software is provided "as
                is" without warranty of any kind, either express or implied. The
                developer shall not be liable for any damages resulting from the
                use of the software. Changes to Terms and Conditions: The
                developer reserves the right to change these terms and
                conditions at any time. The user will be notified of any changes
                and will be required to accept the new terms and conditions
                before continuing to use the software. Governing Law: This
                agreement shall be governed by and construed in accordance with
                the laws of Canada.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                Warranties
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                AuditX makes no express or implied warranties or representations
                with respect to the Program. AuditX makes no representation that
                the operation of the Program will be uninterrupted or
                error-free, and AuditX will not be liable for the consequences
                of any interruptions or errors. You represent and warrant the
                following: 1) You have the legal authority to enter into this
                Agreement and to be bound to the terms and policies set forth in
                this Agreement. 2) Your content does not contain any materials
                that are: (a) Unlawful or solicitous of behavior that is
                unlawful in Canada and the United States. (b) Unlawful or
                solicitous of behavior that is unlawful in the geographic area
                from which you operate. 3) You have obtained any necessary
                clearances, licenses, or other permission for any intellectual
                property used on your content. Nothing on your content infringes
                upon the intellectual property rights of any person or entity.
                No person or entity has brought or threatened an action claiming
                such infringement, nor do you have any reason to believe that
                any person or entity will bring or threaten such a claim in the
                future. 4) You do not compete with AuditX. You are not an
                employee, agent, or partner with any person or company that
                competes with AuditX. You may not be an Ambassador with or an
                independent contractor to persons or companies that compete with
                AuditX.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                Indemnification
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                You will indemnify and hold harmless AuditX from any claim,
                damage, lawsuit, action, complaint, or other costs arising out
                of any breach of your warranties set forth above. You will also
                indemnify and hold harmless AuditX for any damage, loss, or
                other cost arising out of your use or misuse of the Assets.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                Confidentiality
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                Any information that you are exposed to by virtue of your
                relationship with AuditX under these terms and policies, which
                information is not available to the general public, shall be
                considered to be confidential company information. You may not
                disclose any confidential company information to any person or
                entity, except where compelled by law, unless you obtain prior
                written consent for such disclosure from AuditX.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                Liability
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                AuditX will not be liable for any loss of profits or costs, or
                for any direct, indirect, special, incidental, or consequential
                damages, including costs associated with the procurement of
                substitute goods or services (whether AuditX was or should have
                been aware or advised of the possibility of such damage),
                arising out of or associated with any loss, suspension, or
                interruption of service, termination of this Agreement, use or
                misuse of the Assets, or other performance of services under
                this Agreement.
              </div>
              <div className="UserTermsAndConditions_heading__P9cxs">
                Non-Competition
              </div>
              <div className="UserTermsAndConditions_text__z1Rwu">
                By using our AuditX CRM application and/or consulting with us,
                you agree not to directly participate in any business
                development that competes with AuditX for a period of 36 months
                following the termination of your use of our application and/or
                consulting relationship with us. This includes, but is not
                limited to: Starting or working for a competing CRM company:
                This clause prohibits you from taking an active role in the
                management, ownership, or operation of a business that directly
                competes with AuditX. Soliciting our clients or business
                partners: This clause prohibits you from reaching out to
                AuditX's clients or business partners and attempting to take
                them away from AuditX. Sharing confidential information obtained
                during your use of our application and/or consulting
                relationship with us with any third party for the purpose of
                competing against AuditX. This clause prohibits you from sharing
                any confidential information, knowledge or any other proprietary
                information you gained during your engagement with AuditX with
                any other party that can use it to compete against AuditX.
                Furthermore, you agree not to utilize any information,
                strategies, or techniques learned or developed during your use
                of our AuditX CRM application and/or consulting relationship
                with us to compete against AuditX in any form of CRM services,
                including but not limited to: 1. CRM software development: This
                clause prohibits you from developing CRM software that is
                similar or identical to AuditX's CRM application. 2. CRM
                software consulting: This clause prohibits you from providing
                consulting services to other companies or organizations that
                compete with AuditX in any way. 3. CRM software implementation:
                This clause prohibits you from implementing CRM software for
                other companies or organizations that compete with AuditX in any
                way. 4. CRM data analysis: This clause prohibits you from
                analyzing CRM data for other companies or organizations that
                compete with AuditX in any way. 5. CRM marketing or sales
                strategies: This clause prohibits you from using any marketing
                or sales strategies learned or developed during your use of our
                AuditX CRM application and/or consulting relationship with us to
                compete against AuditX in any form of CRM services. 6. CRM
                customer support or training: This clause prohibits you from
                providing customer support or training to other companies or
                organizations that compete with AuditX in any way. Any violation
                of this non-competition clause will result in immediate
                termination of your use of our AuditX CRM application and/or
                consulting relationship with us, and may also result in legal
                action. Any loss of profit, including but not limited to,
                direct, indirect, consequential, special, or incidental damages
                suffered by AuditX as a result of a violation of this
                non-competition clause must be fully reimbursed by the violator.
                This includes, but is not limited to: loss of business, loss of
                goodwill, loss of reputation, and any other damages suffered by
                AuditX as a result of the violation.
              </div>
              <div className="UserTermsAndConditions_checkboxWrapper__tYBBp">
                <div className="UserTermsAndConditions_checkbox__eEoMR">
                  <div className="RadioGroup_radioGroup__J8jLq">
                    <span className="RadioGroup_text__axZuJ">
                      I have read, understood and accepted the terms and
                      conditions.
                    </span>
                    <Checkbox
                      className="border-3 border-balck"
                      onChange={(e) => setReadAllTerms(e.target.checked)}
                      label={
                        <Typography
                          color="blue-gray"
                          className="flex font-medium"
                        >
                          I have read, understood and accepted the terms and
                          conditions.
                        </Typography>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpen}>
            cancel
          </Button>
          <Button
            variant="gradient"
            disabled={!readed}
            className={"bg-themePrimary"}
            onClick={handleOpen}
          >
            confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
