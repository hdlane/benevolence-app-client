import React from "react";

function Help() {
    return <>
        <div className="content flex flex-col h-full m-4 p-4 bg-white rounded-lg">
            <img loading="lazy" alt="Benevolence App" src="https://github.com/user-attachments/assets/ef388283-4b4d-41a5-83fb-079928fe3e06" className="w-full max-w-md mx-auto my-4" />

            <div className="max-w-screen-lg mx-auto px-4 py-8">
                <section>
                    <h1 className="text-center text-3xl font-semibold mb-8">Benevolence App Documentation</h1>

                    <p>The <strong>Benevolence App</strong> is a solution designed to simplify the management of donation requests, meals, and services. It integrates with Planning Center People to create a streamlined process for admins and users in your organization.</p>
                </section>

                <hr className="my-6" />

                <section>
                    <h2 className="text-2xl font-semibold mb-4">For Admins</h2>

                    <h3 className="text-xl font-semibold">Overview</h3>
                    <p>As an admin, you have the responsibility of managing requests, syncing data with <strong>Planning Center People</strong>, and overseeing analytics. Here’s how you can get started:</p>

                    <hr className="my-6" />

                    <h3 className="text-xl font-semibold">Getting Started</h3>

                    <h4 className="text-lg font-semibold mt-4">1. Authorize Benevolence App with Planning Center</h4>
                    <p>Before using the app, you need to authorize Benevolence App with your <strong>Planning Center</strong> account. Follow these steps:</p>
                    <ul className="list-disc pl-8">
                        <li>Log in to your <strong>Planning Center</strong> account as an administrator, Manager, or Editor.</li>
                        <li>Go to the <a href="https://app.benevolenceapp.com/login" className="text-[#396056]">Benevolence App Login Page</a>.</li>
                        <li>Click on <strong>"Authorize with Planning Center"</strong>.</li>
                    </ul>
                    <p>
                        <img loading="lazy" src="https://github.com/user-attachments/assets/ef7775a6-6e78-4eae-82a3-747783bc001d" className="w-full max-w-md mx-auto my-4 border" />
                    </p>
                    <p>You will be redirected to <strong>Planning Center</strong> to confirm the authorization. Allow access and click <strong>"Authorize for Benevolence App"</strong>.</p>

                    <h4 className="text-lg font-semibold mt-4">2. Log In</h4>
                    <p>After authorization, log in to the app by following these steps:</p>
                    <ul className="list-disc pl-8">
                        <li>Log in using your <strong>Planning Center</strong> email address.</li>
                        <li>Click on the <strong>login link</strong> sent to your email.</li>
                        <li>Select the organization you want to access and the user you are signing in as.</li>
                    </ul>
                    <p>
                        <img loading="lazy" src="https://github.com/user-attachments/assets/2c84b4a6-5739-44ca-9c8f-67604777f497" className="w-full max-w-md mx-auto my-4 border" />
                    </p>

                    <h4 className="text-lg font-semibold mt-4">3. Sync Data</h4>
                    <p>Once logged in, perform an <strong>initial sync</strong> to pull the latest data from Planning Center People:</p>
                    <ul className="list-disc pl-8">
                        <li>Navigate to the <strong>Admin page</strong>.</li>
                        <li>Click <strong>"Sync Now"</strong>.</li>
                    </ul>
                    <p>
                        <img loading="lazy" src="https://github.com/user-attachments/assets/f72ed073-7adc-4eb3-9c90-0ecb74a5548e" className="w-full max-w-md mx-auto my-4 border" />
                    </p>

                    <hr className="my-6" />

                    <h3 className="text-xl font-semibold">Managing Requests</h3>
                    <p>Requests are the core of Benevolence App. As an admin, you will create and manage three types of requests: <strong>Donations</strong>, <strong>Meals</strong>, and <strong>Services</strong>.</p>

                    <h4 className="text-lg font-semibold mt-4">1. Create a New Request</h4>
                    <p>To create a request:</p>
                    <ul className="list-disc pl-8">
                        <li>Go to the <strong>Admin page</strong>.</li>
                        <li>Click <strong>"New Request"</strong>.</li>
                        <li>Fill out the form with the following details:
                            <ul className="list-inside list-disc">
                                <li><strong>Type</strong> (Donation, Meal, Service)</li>
                                <li><strong>Title</strong> of the request</li>
                                <li><strong>Recipient</strong> (individual receiving the donation or service)</li>
                                <li><strong>Coordinator</strong> (person coordinating the request)</li>
                                <li><strong>Additional Information</strong> (notes, dates, times)</li>
                                <li><strong>Location</strong> (address for fulfillment)</li>
                            </ul>
                        </li>
                    </ul>

                    <h4 className="text-lg font-semibold mt-4">2. Managing Donation Requests</h4>
                    <p>Donation requests are for tangible needs such as food, clothing, and financial aid.</p>
                    <ul className="list-disc pl-8">
                        <li>Specify the items needed and their quantities.</li>
                        <li>Users can sign up for specific items (or all items) based on availability.</li>
                    </ul>

                    <h4 className="text-lg font-semibold mt-4">3. Managing Meal Requests</h4>
                    <p>Meal requests are for providing food, typically for life events like births, funerals, or church events.</p>
                    <p><strong>Important:</strong> Once a meal request is created, the delivery dates <strong>cannot</strong> be changed, so double-check your dates before submitting.</p>

                    <h4 className="text-lg font-semibold mt-4">4. Managing Service Requests</h4>
                    <p>Service requests are for offering assistance, like yard work, transportation, or cleaning.</p>

                    <hr className="my-6" />

                    <h3 className="text-xl font-semibold">Viewing Analytics</h3>
                    <p>As an admin, you can view basic analytics for your organization:</p>
                    <ul className="list-disc pl-8">
                        <li>Total number of synced users</li>
                        <li>Total number of requests</li>
                        <li>Breakdown of unfulfilled requests (those with open slots)</li>
                        <li>Requests categorized by type (Donations, Meals, Services)</li>
                    </ul>
                    <p>Go to the <strong>Admin page</strong> to see the analytics dashboard.</p>

                    <hr className="my-6" />

                    <h3 className="text-xl font-semibold">Frequently Asked Questions for Admins</h3>

                    <h4 className="text-lg font-semibold mt-4">How do I sync my organization’s data?</h4>
                    <p>Make sure to click <strong>"Sync Now"</strong> in the <strong>Admin page</strong> every time you make changes in <strong>Planning Center People</strong> to reflect those updates in Benevolence App.</p>

                    <h4 className="text-lg font-semibold mt-4">Why aren’t my changes showing up in Benevolence App?</h4>
                    <p>Ensure that you have completed the sync process. If the data is still not updating, verify that your <strong>Planning Center People</strong> account is correctly synced and authorized.</p>

                    <hr className="my-6" />
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">For Users</h2>

                    <h3 className="text-xl font-semibold">Overview</h3>
                    <p>As a user, you can sign up for donation, meal, and service requests, and keep track of your assigned slots. Below is how you can get started.</p>

                    <hr className="my-6" />

                    <h3 className="text-xl font-semibold">Getting Started</h3>

                    <h4 className="text-lg font-semibold mt-4">1. Log In to Benevolence App</h4>
                    <p>To begin, you need to log in using your <strong>Planning Center</strong> email address:</p>
                    <ul className="list-disc pl-8">
                        <li>Once logged in, click the <strong>login link</strong> sent to your email.</li>
                        <li>Select the organization and user you wish to sign in as.</li>
                    </ul>
                    <p>
                        <img loading="lazy" src="https://github.com/user-attachments/assets/fbb28c02-d400-46a3-b757-c1e26e534edb" className="w-full max-w-md mx-auto my-4 border" />
                    </p>

                    <h3 className="text-xl font-semibold mt-4">2. Signing Up for Requests</h3>
                    <p>Requests are categorized as Donations, Meals, and Services. Here’s how you can sign up:</p>
                    <ul className="list-disc pl-8">
                        <li>Go to the <strong>Dashboard</strong>.</li>
                        <li>Browse the available requests and check for open slots.</li>
                        <li>Click the <strong>Actions</strong> button next to a request and choose <strong>Sign Up</strong>.</li>
                    </ul>
                    <p>You will receive an email notification confirming your participation.</p>

                    <h3 className="text-xl font-semibold mt-4">3. Cancelling an Assignment</h3>
                    <p>If you need to cancel your participation:</p>
                    <ul className="list-disc pl-8">
                        <li>Go to your <strong>Dashboard</strong>.</li>
                        <li>Find the request you’re part of.</li>
                        <li>Click the <strong>Actions</strong> button and choose <strong>Unassign</strong>.</li>
                        <li>You will receive a confirmation email once removed.</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-4">4. Viewing Details</h3>
                    <p>To see more details about a request:</p>
                    <ul className="list-disc pl-8">
                        <li>For <strong>Donations</strong>: Click <strong>Actions</strong> and select <strong>Details</strong> to see a breakdown of who signed up and what items are needed.</li>
                        <li>For <strong>Meals</strong>: The request will show who is providing and what items they are bringing.</li>
                        <li>For <strong>Services</strong>: Click <strong>Actions</strong> to see detailed information about the service request.</li>
                    </ul>

                    <hr className="my-6" />

                    <h3 className="text-xl font-semibold">Frequently Asked Questions for Users</h3>

                    <h4 className="text-lg font-semibold mt-4">How do I sign up for a request?</h4>
                    <p>Go to the <strong>Dashboard</strong>, select a request, and click the <strong>Actions</strong> button. Choose <strong>Sign Up</strong> for the available slots.</p>

                    <h4 className="text-lg font-semibold mt-4">How do I cancel my participation in a request?</h4>
                    <p>In the <strong>Dashboard</strong>, find the request you signed up for. Click <strong>Actions</strong> and select <strong>Unassign</strong> to cancel.</p>

                    <h4 className="text-lg font-semibold mt-4">How do I view the details of a request?</h4>
                    <p>Click on <strong>Actions</strong> next to any request and select <strong>Details</strong> to see all the information about what is needed and who has already signed up.</p>

                </section>
            </div>
        </div>
    </>
}

export default Help;
