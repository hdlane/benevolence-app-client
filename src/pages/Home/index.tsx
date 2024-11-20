import React, { useState } from "react";

function Home() {

    return <>
        <div className="content flex flex-col h-full m-4 p-4 bg-white rounded-lg">
            <img loading="lazy" alt="Benevolence App" src="https://github.com/user-attachments/assets/ef388283-4b4d-41a5-83fb-079928fe3e06" className="w-full max-w-md mx-auto my-4" />
            <div className="max-w-screen-lg mx-auto px-4 py-8">
                <section className="my-6">
                    <h1 className="text-center text-3xl font-semibold">Welcome To Benevolence App</h1>
                    <h2 className="text-center text-lg font-semibold mb-8">A Tool for Managing Donations, Meals, and Services</h2>
                    <p>The <strong>Benevolence App</strong> helps your organization provide meals, services, and item donations to those in need—seamlessly integrated with Planning Center. If you're already using Planning Center, you can easily sync your users, create requests, and keep track of everything in one place.</p>
                    <ul className="list-disc pl-5 pt-4">
                        <li><strong>Seamless Integration with Planning Center:</strong> Automatically sync users, admins, and data with Planning Center People.</li>
                        <li><strong>Intuitive Request Management:</strong> Easily create, track, and fulfill requests for donations, meals, and services.</li>
                        <li><strong>Get Notified:</strong> Admins and users get notifications, keeping everyone on the same page.</li>
                    </ul>
                </section>

                <hr className="my-6" />

                <section className="my-6">
                    <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                    <ul className="list-disc pl-5">
                        <li><strong>User Management:</strong> Sync all your users from Planning Center and grant them access to the Benevolence App.</li>
                        <li><strong>Multi-Organization Support:</strong> If you're involved with multiple organizations, choose which one to sign in to with ease.</li>
                        <li><strong>Request Creation:</strong> Admins can create donation, meal, and service requests and specify recipients and coordinators.</li>
                        <li><strong>Analytics for Admins:</strong> Track the status of your requests, view unfulfilled slots, and monitor overall progress.</li>
                    </ul>
                </section>

                <hr className="my-6" />

                <section className="my-6">
                    <h3 className="text-xl font-semibold mb-4">How It Works</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li><strong>Authorize Benevolence App:</strong> Easily connect Benevolence App to your Planning Center account. As an admin, simply log in to authorize your organization.</li>
                        <li><strong>Create & Manage Requests:</strong> Whether it's food, clothing, or yard work, admins can create specific requests that people can sign up to fulfill.</li>
                        <li><strong>Track Progress:</strong> Admins get a clear overview of all requests and can track the status of each item, meal, or service.</li>
                        <li><strong>Seamless Communication:</strong> Users receive automatic notifications when they’re assigned to a request or when the request is updated.</li>
                    </ol>
                </section>

                <hr className="my-6" />

                <section className="my-6">
                    <h3 className="text-xl font-semibold mb-4">For Users</h3>
                    <ul className="list-disc pl-5">
                        <li><strong>Sign Up for Requests:</strong> Browse requests and sign up to provide items, meals, or services.</li>
                        <li><strong>Get Notified:</strong> Receive email updates when you’re assigned to a request or when the request is updated.</li>
                        <li><strong>Cancel or Modify:</strong> Need to cancel? It's easy to unassign yourself with a few clicks.</li>
                    </ul>
                </section>

                <hr className="my-6" />

                <section className="my-6">
                    <h3 className="text-xl font-semibold mb-4">For Admins</h3>
                    <ul className="list-disc pl-5">
                        <li><strong>Create & Customize Requests:</strong> Set up donation, meal, and service requests tailored to your organization’s needs.</li>
                        <li><strong>Manage Slots & Assignments:</strong> Control the slots for each request and see who’s signed up to fulfill them.</li>
                        <li><strong>Sync with Planning Center:</strong> Keep all your data up to date by syncing with Planning Center People.</li>
                        <li><strong>Monitor Analytics:</strong> Track the total number of requests, people involved, and unfulfilled slots to keep your programs running smoothly.</li>
                    </ul>
                </section>

                <hr className="my-6" />

                <section className="my-6">
                    <h3 className="text-xl font-semibold mb-4">Get Started Today</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li><strong>Sign Up for Planning Center:</strong> Don’t have a Planning Center account yet? No worries, sign up for free <a href="https://www.planningcenter.com/" className="text-[#396056] hover:text-[#84A296]">here</a>.</li>
                        <li><strong>Log In to Benevolence App:</strong> After creating your account, log in to Benevolence App and start managing requests right away.</li>
                        <li><strong>Sync & Manage:</strong> Sync your organization’s data from Planning Center and start creating requests!</li>
                    </ol>
                </section>

                <hr className="my-6" />

                <section className="my-6">
                    <h3 className="text-xl font-semibold mb-4">Ready to Help? Start Now!</h3>
                    <a href="/signup" style={{ textDecoration: "none", color: "#ffffff" }} className="button-primary">Sign up</a>
                </section>

                <hr className="my-6" />

                <section className="my-6">
                    <h3 className="text-xl font-semibold mb-4">FAQs</h3>
                    <h4 className="font-semibold">How do I sign up or cancel my participation in a request?</h4>
                    <p>Go to your Dashboard, select a request, and sign up for the available slots. To cancel, simply unassign yourself.</p>

                    <h4 className="font-semibold mt-4">How do I view the details of a request?</h4>
                    <p>Admins can view the details of all requests, while users can check the request description to see who’s already signed up and what’s needed.</p>

                    <h4 className="font-semibold mt-4">How can I track my organization’s progress?</h4>
                    <p>Admins can view key metrics like total synced users, the number of requests, and the fulfillment status from the Admin page.</p>
                </section>

                <hr className="my-6" />

                <section className="my-6">
                    <h3 className="text-xl font-semibold mb-4">Use Benevolence App to Make a Difference</h3>
                    <p>Let Benevolence App help you organize and manage your outreach programs with ease and efficiency!</p>
                </section>
            </div>
        </div>
    </>
}

export default Home;
